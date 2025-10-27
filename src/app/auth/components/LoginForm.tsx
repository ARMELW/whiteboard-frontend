import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginCredentials } from '../schema';
import { useAuth } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    
    await login(data, {
      onSuccess: () => {
        toast.success('Connexion réussie !');
        navigate('/', { replace: true });
      },
      onError: (err: Error) => {
        const message = err?.message || 'Erreur de connexion';
        setError(message);
        toast.error(message);
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-gray-500">
          Connectez-vous à votre compte Whiteboard Animation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@example.com"
            {...register('email')}
            disabled={isLoggingIn}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoggingIn}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Pas encore de compte ? </span>
        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
