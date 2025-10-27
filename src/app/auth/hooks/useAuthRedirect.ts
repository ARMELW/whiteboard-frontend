import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './useSession';

/**
 * Hook to redirect authenticated users to the dashboard
 * Used on public pages (landing, login, signup) to prevent authenticated users from accessing them
 */
export function useAuthRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
}
