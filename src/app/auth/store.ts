import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthSession } from './types';

interface AuthState {
  session: AuthSession | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setSession: (session: AuthSession | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setSession: (session) =>
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
          isLoading: false,
        }),

      setUser: (user) =>
        set((state) => ({
          user,
          session: user && state.session ? { ...state.session, user } : state.session,
        })),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      clearAuth: () =>
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          return {
            user: updatedUser,
            session: state.session ? { ...state.session, user: updatedUser } : null,
          };
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
