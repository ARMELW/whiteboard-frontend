import { SignupForm } from '@/app/auth/components';
import { useAuthRedirect } from '@/app/auth';

export function SignupPage() {
  useAuthRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <SignupForm />
    </div>
  );
}
