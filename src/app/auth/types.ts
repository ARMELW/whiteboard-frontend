import { z } from 'zod';
import { loginSchema, signupSchema } from './schema';

export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignupCredentials = z.infer<typeof signupSchema>;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  planId: 'free' | 'starter' | 'pro' | 'enterprise';
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: AuthSession;
  errors?: Record<string, string[]>;
}
