import { create } from 'zustand';
import { UserProfile } from '@/lib/firebase/authService';

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  isDemoMode: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo })
}));
