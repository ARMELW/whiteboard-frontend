import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOut } from '@/lib/auth-client';
import type { LoginCredentials, SignupCredentials } from '../types';

export function useAuth() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [signupError, setSignupError] = useState<Error | null>(null);

  const login = useCallback(async (
    credentials: LoginCredentials,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (result.error) {
        const error = new Error(result.error.message || 'Login failed');
        setLoginError(error);
        options?.onError?.(error);
      } else {
        options?.onSuccess?.({ success: true, session: result.data });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Login failed');
      setLoginError(err);
      options?.onError?.(err);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const signup = useCallback(async (
    credentials: SignupCredentials,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    setIsSigningUp(true);
    setSignupError(null);
    
    try {
      const result = await signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: `${credentials.firstName} ${credentials.lastName || ''}`.trim(),
      });

      if (result.error) {
        const error = new Error(result.error.message || 'Signup failed');
        setSignupError(error);
        options?.onError?.(error);
      } else {
        options?.onSuccess?.({ success: true, session: result.data });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Signup failed');
      setSignupError(err);
      options?.onError?.(err);
    } finally {
      setIsSigningUp(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate]);

  return {
    // Mutations
    login,
    signup,
    logout,

    // Mutation states
    isLoggingIn,
    isSigningUp,
    isLoggingOut,

    // Mutation results
    loginError,
    signupError,
  };
}
