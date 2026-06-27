import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export const reviewService = {
  getByAnime: async (animeId, limitCount = 20) => {
    const snap = await getDocs(
      query(
        collection(db, 'reviews'),
        where('animeId', '==', animeId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByUser: async (userId) => {
    const snap = await getDocs(
      query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  create: async (reviewData) => {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      helpfulCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  update: async (reviewId, data) => {
    await updateDoc(doc(db, 'reviews', reviewId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  delete: async (reviewId) => {
    await deleteDoc(doc(db, 'reviews', reviewId));
  },
};
