import { create } from 'zustand';
import { authService } from '@/services/firebase/authService';
import { userService } from '@/services/firebase/userService';

const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  initialize: () => {
    if (!authService.onAuthChanged) {
      set({ loading: false });
      return;
    }
    authService.onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await userService.getProfile(firebaseUser.uid);
        if (!profile) {
          await userService.createProfile(firebaseUser.uid, {
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
          });
          profile = await userService.getProfile(firebaseUser.uid);
        }
        set({ user: firebaseUser, userProfile: profile, loading: false, error: null });
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      await authService.loginWithEmail(email, password);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ error: null });
    try {
      const cred = await authService.registerWithEmail(email, password, displayName);
      await userService.createProfile(cred.user.uid, {
        displayName,
        email,
        photoURL: '',
      });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ error: null });
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, userProfile: null });
  },

  setError: (error) => set({ error }),
}));

export default useAuthStore;
