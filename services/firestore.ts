
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { Session } from '../types';

export class FirestoreService {
  db: any = null;
  auth: any = null;
  userId: string | null = null;
  initialized = false;

  constructor() {}

  async init(configStr: string) {
    if (!configStr) return false;
    try {
      const config = JSON.parse(configStr);
      const app = !getApps().length ? initializeApp(config) : getApp();
      this.db = getFirestore(app);
      this.auth = getAuth(app);
      const userCred = await signInAnonymously(this.auth);
      this.userId = userCred.user.uid;
      this.initialized = true;
      return true;
    } catch (e) {
      console.error("Firebase init error", e);
      return false;
    }
  }

  async syncSession(session: Session) {
    // Never sync off-record sessions
    if (!this.initialized || !this.userId || session.config.privacy === 'off-record') return;
    try {
      const ref = doc(this.db, 'users', this.userId, 'sessions', session.id);
      await setDoc(ref, session);
    } catch (e) { console.error("Sync error", e); }
  }

  async loadSessions(): Promise<Session[]> {
    if (!this.initialized || !this.userId) return [];
    try {
      const q = query(collection(this.db, 'users', this.userId, 'sessions'));
      const snapshot = await getDocs(q);
      const sessions = snapshot.docs.map((d: any) => d.data() as Session);
      return sessions
        .sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (e) {
      return [];
    }
  }
}

export const firestoreService = new FirestoreService();
