import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/app/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  // Ne protège que les routes autres que '/'
  /**if (!isAuthenticated && location.pathname !== '/') {
    // Redirect to landing page while saving the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }**/

  return <>{children}</>;
}
