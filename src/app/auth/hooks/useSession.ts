import { useSession as useBetterAuthSession } from '@/lib/auth-client';

export function useSession() {
  const { data: session, isPending, error } = useBetterAuthSession();

  return {
    session: session || null,
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    planId: session?.user?.planId || 'free',
  };
}
