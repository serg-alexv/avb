# P2P Chat Analysis & Implementation Plan

## Objective
Enable Human-to-Human (P2P) chat within Anonvibe using WebRTC for direct data transfer and Firebase Firestore as the signaling layer.

## Architecture
**WebRTC (Peer-to-Peer)**:
- **Data Channel**: Used for sending text messages directly between clients. Low latency, private (data doesn't touch a server database, only signaling data does).
- **ICE/Signaling**: We need a way to exchange SDP offers/answers. Firestore will act as the "Post-It Board" where clients exchange these connection details.

## 1. Data Structure (Firestore)
We will use a temporary collection `p2p_channels` (or specific paths in the user's db if strictly scoped, but a global shared collection is easier for anonymous pairing).

**Document: `p2p_channels/{channelId}`**
```json
{
  "hostId": "user_A_id",
  "guestId": "user_B_id",
  "offer": { "type": "offer", "sdp": "..." },
  "answer": { "type": "answer", "sdp": "..." },
  "status": "waiting" | "connected" | "closed"
}
```
**Subcollections:**
- `p2p_channels/{channelId}/callee_candidates`
- `p2p_channels/{channelId}/caller_candidates`

## 2. Implementation Steps

### Phase 1: Core Services
1.  **Modify `services/firestore.ts`**: Ensure it exposes generic helpers for `setDoc`, `onSnapshot` (for real-time updates) for arbitrary paths.
2.  **Create `services/p2p.ts`**:
    - `createRoom()`: Generates a 6-digit code. Creates Firestore doc. Listens for Answer.
    - `joinRoom(code)`: Fetches doc. Generates Answer. Listens for Candidates.
    - `setupWebRTC()`: Managed `RTCPeerConnection` and `RTCDataChannel`.

### Phase 2: React State
1.  **Update `types.ts`**: Add `isP2P` and `channelId` to `Session`.
2.  **App State**: Needs a way to "hook" the P2P service's `onMessage` event to update the `activeSession` message list.

### Phase 3: UI-Flow
1.  **"Human Connection" Button**: (In Discovery or Sidebar).
2.  **Connection Modal**:
    - **Tab 1: Host**: Shows spinner + "Share this code: 123-456".
    - **Tab 2: Join**: Input field for code.
3.  **Chat Interface**:
    - Add visual indicator ("🟢 Encrypted P2P Connection").
    - Disable AI features (Icebreaker, Magic Rewrite) for this mode? Or keep them running locally? (Keep enabled, they run on client text).

## 3. Security & Privacy
- **Direct**: Messages go peer-to-peer.
- **Signaling**: SDP data goes through Firestore (Google servers), but this is just connection info, not message content.
- **Cleanup**: Rooms should be deleted/marked expired after the session ends.

## 4. Next Actions
- [ ] Create `services/p2p.ts`.
- [ ] Update `types.ts` to support P2P sessions.
- [ ] Create the "Connection Modal" component.
