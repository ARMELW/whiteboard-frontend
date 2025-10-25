import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store';
import { authService } from '../api/authService';
import { authKeys } from '../config';
import type { LoginCredentials, SignupCredentials } from '../types';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { session, user, isAuthenticated, setSession, clearAuth, setLoading } = useAuthStore();

  const sessionQuery = useQuery({
    queryKey: authKeys.detail('session'),
    queryFn: async () => {
      const storedSession = authService.getStoredSession();
      if (!storedSession) {
        setSession(null);
        return null;
      }

      const currentSession = await authService.getCurrentUser();
      if (!currentSession) {
        setSession(null);
        return null;
      }

      setSession(currentSession);
      return currentSession;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.session) {
        setSession(response.session);
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => authService.signup(credentials),
    onSuccess: (response) => {
      if (response.success && response.session) {
        setSession(response.session);
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (newSession) => {
      if (newSession) {
        setSession(newSession);
      } else {
        clearAuth();
      }
    },
  });

  return {
    // State
    session,
    user,
    isAuthenticated,
    isLoading: sessionQuery.isLoading,

    // Mutations
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Mutation results
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    
    // Helpers
    refetchSession: sessionQuery.refetch,
  };
}
