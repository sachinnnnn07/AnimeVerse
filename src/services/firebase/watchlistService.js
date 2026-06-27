import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const getWatchlistRef = (uid) => collection(db, 'users', uid, 'watchlist');

export const watchlistService = {
  getAll: async (uid) => {
    const snap = await getDocs(
      query(getWatchlistRef(uid), orderBy('updatedAt', 'desc'))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getOne: async (uid, animeId) => {
    const snap = await getDoc(doc(db, 'users', uid, 'watchlist', String(animeId)));
    return snap.exists() ? snap.data() : null;
  },

  add: async (uid, animeData) => {
    await setDoc(doc(db, 'users', uid, 'watchlist', String(animeData.animeId)), {
      ...animeData,
      addedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  update: async (uid, animeId, data) => {
    await updateDoc(doc(db, 'users', uid, 'watchlist', String(animeId)), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  remove: async (uid, animeId) => {
    await deleteDoc(doc(db, 'users', uid, 'watchlist', String(animeId)));
  },
};
