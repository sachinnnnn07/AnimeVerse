import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const userService = {
  getProfile: async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  },

  createProfile: async (uid, data) => {
    await setDoc(doc(db, 'users', uid), {
      uid,
      ...data,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  updateProfile: async (uid, data) => {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
