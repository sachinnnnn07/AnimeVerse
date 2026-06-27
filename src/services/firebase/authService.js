import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export const authService = auth ? {
  loginWithEmail: (email, password) =>
    signInWithEmailAndPassword(auth, email, password),

  registerWithEmail: async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred;
  },

  loginWithGoogle: () => signInWithPopup(auth, googleProvider),

  logout: () => signOut(auth),

  resetPassword: (email) => sendPasswordResetEmail(auth, email),

  onAuthChanged: (callback) => onAuthStateChanged(auth, callback),
} : {
  loginWithEmail: () => Promise.reject(new Error('Firebase not configured')),
  registerWithEmail: () => Promise.reject(new Error('Firebase not configured')),
  loginWithGoogle: () => Promise.reject(new Error('Firebase not configured')),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.reject(new Error('Firebase not configured')),
  onAuthChanged: null,
};
