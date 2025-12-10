
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  Firestore,
  Unsubscribe,
  Timestamp,
  increment,
  updateDoc
} from "firebase/firestore";
import { getAuth, signInAnonymously, Auth } from "firebase/auth";
import { Session, Message, ChatConfig } from '../types';

export class FirestoreService {
  db: Firestore | null = null;
  auth: Auth | null = null;
  userId: string | null = null;
  initialized = false;
  initPromise: Promise<boolean> | null = null;
  unsubMap: Map<string, Unsubscribe> = new Map();

  constructor() { }

  async init(configStr: string): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (!configStr) return false;
      try {
        const config = JSON.parse(configStr);
        const app = !getApps().length ? initializeApp(config) : getApp();
        this.db = getFirestore(app);
        this.auth = getAuth(app);

        // Wait for auth
        const userCred = await signInAnonymously(this.auth);
        this.userId = userCred.user.uid;

        this.initialized = true;
        console.log("Firestore initialized for user:", this.userId);
        return true;
      } catch (e) {
        console.error("Firebase init error", e);
        return false;
      }
    })();

    return this.initPromise;
  }

  async waitForInit(): Promise<boolean> {
    if (this.initialized) return true;
    if (this.initPromise) return this.initPromise;
    return false; // Not started
  }

  // --- Realtime Chat Rooms ---


  subscribeToMessages(roomId: string, onUpdate: (messages: Message[]) => void) {
    // We can't await in a sync function so we launch an async wrapper
    this.waitForInit().then(isInit => {
      if (!isInit || !this.db || !this.userId) return; // Should handle error reporting callback

      // Unsubscribe previous listener for this room if exists
      this.unsubscribe(roomId);

      const q = query(
        collection(this.db, 'rooms', roomId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(200)
      );

      const unsub = onSnapshot(q, {
        next: (snapshot) => {
          const msgs: Message[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              role: data.userId === this.userId ? 'user' : 'model',
              content: data.text,
              timestamp: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
              status: 'sent'
            };
          });
          onUpdate(msgs);
        },
        error: (error) => {
          console.error("Snapshot error:", error);
          // Could trigger an error callback if we had one
        }
      });

      this.unsubMap.set(roomId, unsub);
    });
  }

  unsubscribe(roomId: string) {
    if (this.unsubMap.has(roomId)) {
      this.unsubMap.get(roomId)?.();
      this.unsubMap.delete(roomId);
    }
  }

  async sendMessage(roomId: string, text: string) {
    if (!await this.waitForInit() || !this.db || !this.userId) throw new Error("Not initialized");

    try {
      await addDoc(collection(this.db, 'rooms', roomId, 'messages'), {
        userId: this.userId,
        text: text,
        createdAt: serverTimestamp(),
        roomId: roomId,
        deleted: false
      });
    } catch (e) {
      console.error("Error sending message:", e);
      throw e;
    }
  }

  // --- Public Rooms & Presence ---

  // --- Public Rooms & Presence ---

  async createPublicRoom(topic: string, mode: ChatConfig['mode']): Promise<string> {
    if (!await this.waitForInit() || !this.db) throw new Error("Not initialized");
    try {
      // 1. Create the room doc
      const roomRef = await addDoc(collection(this.db, 'public_rooms'), {
        topic,
        createdAt: serverTimestamp(),
        activeUsers: 1, // Start with 1 (creator)
        mode: mode
      });

      // 2. Also ensure the actual chat room exists
      await this.joinRoom(roomRef.id);

      return roomRef.id;
    } catch (e) {
      console.error("Error creating public room:", e);
      throw e;
    }
  }

  subscribeToPublicRooms(onUpdate: (rooms: any[]) => void) {
    this.waitForInit().then(isInit => {
      if (!isInit || !this.db) return;

      const q = query(
        collection(this.db, 'public_rooms'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onUpdate(rooms);
      });

      this.unsubMap.set('public_rooms', unsub);
    });
  }

  // Join Room with Presence
  async joinRoom(roomId: string) {
    if (!await this.waitForInit() || !this.db || !this.userId) return;

    try {
      const roomRef = doc(this.db, 'rooms', roomId);

      // 1. Ensure room exists
      await setDoc(roomRef, {
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Add self to participants subcollection
      const participantRef = doc(this.db, 'rooms', roomId, 'participants', this.userId);
      await setDoc(participantRef, {
        userId: this.userId,
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      });

      // 3. Update active users count for public rooms (optimistic)
      const publicRoomRef = doc(this.db, 'public_rooms', roomId);
      // We define this as a fire-and-forget attempt. Only works if the public room doc exists.
      updateDoc(publicRoomRef, { activeUsers: increment(1) }).catch(() => {
        // Ignore error (e.g. if room is private and doc doesn't exist)
      });

    } catch (e) {
      console.error("Error joining room:", e);
      throw e;
    }
  }

  subscribeToPresence(roomId: string, onUpdate: (count: number, participants: any[]) => void) {
    this.waitForInit().then(isInit => {
      if (!isInit || !this.db) return;

      const q = collection(this.db, 'rooms', roomId, 'participants');
      const unsub = onSnapshot(q, (snapshot) => {
        const participants = snapshot.docs.map(d => d.data());
        const count = snapshot.size;
        onUpdate(count, participants);
      });
      this.unsubMap.set(`presence_${roomId}`, unsub);
    });
  }

  // --- Legacy Sync ---

  async syncSession(session: Session) {
    if (!this.initialized || !this.userId || session.config.privacy === 'off-record' || session.isFirebaseRoom) return;
    try {
      if (!this.db) return;
      const ref = doc(this.db, 'users', this.userId, 'sessions', session.id);
      await setDoc(ref, session);
    } catch (e) { console.error("Sync error", e); }
  }
}

export const firestoreService = new FirestoreService();
