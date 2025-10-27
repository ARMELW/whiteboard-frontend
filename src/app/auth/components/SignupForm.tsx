import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signupSchema, type SignupCredentials } from '../schema';
import { useAuth } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type SignupFormData = SignupCredentials;

export function SignupForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isSigningUp } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    
    await signup(data, {
      onSuccess: () => {
        toast.success('Compte créé avec succès ! Choisissez votre plan.');
        navigate('/pricing', { replace: true });
      },
      onError: (err: Error) => {
        const message = err?.message || 'Erreur lors de la création du compte';
        setError(message);
        toast.error(message);
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="text-gray-500">
          Commencez gratuitement avec Whiteboard Animation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Prénom
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Jean"
              {...register('firstName')}
              disabled={isSigningUp}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Nom
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Dupont"
              {...register('lastName')}
              disabled={isSigningUp}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vous@example.com"
            {...register('email')}
            disabled={isSigningUp}
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
            disabled={isSigningUp}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmer le mot de passe
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            disabled={isSigningUp}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <input
            id="acceptTerms"
            type="checkbox"
            className="mt-1"
            {...register('acceptTerms')}
            disabled={isSigningUp}
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            J'accepte les{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              conditions d'utilisation
            </Link>{' '}
            et la{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              politique de confidentialité
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSigningUp}
        >
          {isSigningUp ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Vous avez déjà un compte ? </span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
