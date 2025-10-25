import { useAuthStore } from '../store';

export function useSession() {
  const { session, user, isAuthenticated } = useAuthStore();

  return {
    session,
    user,
    isAuthenticated,
    planId: user?.planId || 'free',
  };
}
