
import { firestoreService } from './firestore';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    addDoc,
    query,
    where,
    updateDoc,
    getDocs,
    limit
} from "firebase/firestore";

// Types for Signaling
export interface SignalingMessage {
    type: 'offer' | 'answer' | 'candidate';
    payload: any;
    senderId: string;
}

export class P2PService {
    peers: Map<string, RTCPeerConnection> = new Map();
    dataChannels: Map<string, RTCDataChannel> = new Map();
    channelId: string | null = null;
    userId: string | null = null;

    // Callbacks
    onMessageReceived: ((msg: string, senderId: string) => void) | null = null;
    onConnectionStateChange: ((state: string) => void) | null = null;

    private iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    private unsubs: (() => void)[] = [];

    constructor() { }

    init(userId: string) {
        this.userId = userId;
    }

    async findRandomMatch(): Promise<{ role: 'host' | 'guest', roomId: string }> {
        if (!firestoreService.initialized || !firestoreService.userId) throw new Error("Firebase not initialized");

        // 1. Look for waiting rooms
        const q = query(
            collection(firestoreService.db!, 'p2p_channels'),
            where('status', '==', 'waiting'),
            limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            // Found a room!
            const roomDoc = snapshot.docs[0];
            const roomId = roomDoc.id;

            // Join it
            await this.joinMeshRoom(roomId);

            // Mark as matched (assuming 1:1 for random chat)
            await updateDoc(doc(firestoreService.db!, 'p2p_channels', roomId), {
                status: 'matched'
            });

            return { role: 'guest', roomId };
        } else {
            // Create new waiting room
            const roomRef = await addDoc(collection(firestoreService.db!, 'p2p_channels'), {
                hostId: firestoreService.userId,
                createdAt: Date.now(),
                status: 'waiting'
            });
            await this.joinMeshRoom(roomRef.id);
            return { role: 'host', roomId: roomRef.id };
        }
    }

    // 1. Join or Create a Mesh Room
    async joinMeshRoom(roomId: string) {
        if (!firestoreService.initialized || !firestoreService.userId) throw new Error("Firebase not initialized");
        this.userId = firestoreService.userId;
        this.channelId = roomId;

        // 1. Add self to participants list (signaling presence)
        const participantRef = doc(firestoreService.db!, 'p2p_channels', roomId, 'participants', this.userId);
        await setDoc(participantRef, {
            userId: this.userId,
            joinedAt: Date.now()
        });

        // 2. Listen to OTHER participants
        const q = collection(firestoreService.db!, 'p2p_channels', roomId, 'participants');
        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                const pData = change.doc.data();
                if (pData.userId === this.userId) return; // Skip self

                if (change.type === 'added') {
                    // New peer found!
                    // Rule: The one with lexicographically smaller ID calls the larger ID (to avoid dual calling)
                    // OR: "joiner" calls "existing".
                    // Let's use simple string comparison for mesh.
                    if (this.userId! < pData.userId) {
                        console.log("I am initiating connection to", pData.userId);
                        this.connectToPeer(pData.userId, true);
                    } else {
                        console.log("Waiting for connection from", pData.userId);
                        this.connectToPeer(pData.userId, false); // Prepare to receive
                    }
                }
            });
        });
        this.unsubs.push(unsub);

        // 3. Listen for Signals directed to ME
        const signalsQ = collection(firestoreService.db!, 'p2p_channels', roomId, 'signals');
        // We only care about signals where to == me
        // Firestore query for 'to' == this.userId
        const mySignals = query(signalsQ, where('to', '==', this.userId));

        const unsubSignals = onSnapshot(mySignals, (snapshot) => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    const data = change.doc.data() as any;
                    await this.handleSignal(data);
                    // Optionally delete signal after processing to keep DB clean
                }
            });
        });
        this.unsubs.push(unsubSignals);
    }

    // Connect to a specific peer
    private async connectToPeer(targetPeerId: string, initiator: boolean) {
        if (this.peers.has(targetPeerId)) return; // Already connecting/connected

        const pc = new RTCPeerConnection(this.iceServers);
        this.peers.set(targetPeerId, pc);

        // ICE Candidate Handler
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignal(targetPeerId, 'candidate', event.candidate.toJSON());
            }
        };

        pc.onconnectionstatechange = () => {
            console.log(`Connection to ${targetPeerId}: ${pc.connectionState}`);
            // If any peer connects, we are "connected"
            if (pc.connectionState === 'connected') {
                this.onConnectionStateChange?.('connected');
            }
        };

        pc.ontrack = (event) => {
            console.log(`Received track from ${targetPeerId}`, event.streams[0]);
            this.onTrack?.(event.streams[0], targetPeerId);
        };

        // Data Channel
        if (initiator) {
            const dc = pc.createDataChannel("chat");
            this.setupDataChannel(dc, targetPeerId);

            // Create Offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await this.sendSignal(targetPeerId, 'offer', { type: offer.type, sdp: offer.sdp });
        } else {
            pc.ondatachannel = (event) => {
                this.setupDataChannel(event.channel, targetPeerId);
            };
        }
    }

    private setupDataChannel(dc: RTCDataChannel, peerId: string) {
        dc.onopen = () => {
            console.log(`DataChannel open with ${peerId}`);
            this.dataChannels.set(peerId, dc);
        };
        dc.onmessage = (event) => {
            this.onMessageReceived?.(event.data, peerId);
        };
    }

    private async handleSignal(data: { type: string, payload: any, from: string }) {
        const pc = this.peers.get(data.from);
        // If we don't have a PC yet (non-initiator case where signal arrived before we saw participant?),
        // we should create it.
        if (!pc) {
            // If we are here, it means we are the receiver (initiator=false) logic
            await this.connectToPeer(data.from, false);
            // Re-get
            return this.handleSignal(data);
        }

        const peer = this.peers.get(data.from)!;

        if (data.type === 'offer') {
            await peer.setRemoteDescription(new RTCSessionDescription(data.payload));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            await this.sendSignal(data.from, 'answer', { type: answer.type, sdp: answer.sdp });
        } else if (data.type === 'answer') {
            await peer.setRemoteDescription(new RTCSessionDescription(data.payload));
        } else if (data.type === 'candidate') {
            await peer.addIceCandidate(new RTCIceCandidate(data.payload));
        }
    }

    private async sendSignal(targetId: string, type: string, payload: any) {
        if (!this.channelId || !this.userId) return;
        await addDoc(collection(firestoreService.db!, 'p2p_channels', this.channelId, 'signals'), {
            from: this.userId,
            to: targetId,
            type,
            payload,
            createdAt: Date.now()
        });
    }

    sendMessage(text: string) {
        this.dataChannels.forEach(dc => {
            if (dc.readyState === 'open') {
                dc.send(text);
            }
        });
    }

    // Media Handling
    onTrack: ((stream: MediaStream, peerId: string) => void) | null = null;

    async shareStream(stream: MediaStream) {
        this.peers.forEach(async (pc, peerId) => {
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Renegotiate
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await this.sendSignal(peerId, 'offer', { type: offer.type, sdp: offer.sdp });
        });
    }

    disconnect() {
        this.unsubs.forEach(u => u());
        this.unsubs = [];
        this.peers.forEach(pc => pc.close());
        this.peers.clear();
        this.dataChannels.clear();
        this.channelId = null;
    }
}

export const p2pService = new P2PService();
