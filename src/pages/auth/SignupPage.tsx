import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '@/app/auth/components';
import { useSession } from '@/app/auth';

export function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <SignupForm />
    </div>
  );
}
