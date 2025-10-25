import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.email.required')
    .email('auth.errors.email.invalid'),
  password: z
    .string()
    .min(6, 'auth.errors.password.min')
    .max(100, 'auth.errors.password.max'),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.email.required')
    .email('auth.errors.email.invalid'),
  password: z
    .string()
    .min(6, 'auth.errors.password.min')
    .max(100, 'auth.errors.password.max'),
  confirmPassword: z
    .string()
    .min(1, 'auth.errors.confirmPassword.required'),
  firstName: z
    .string()
    .min(1, 'auth.errors.firstName.required')
    .max(50, 'auth.errors.firstName.max'),
  lastName: z
    .string()
    .max(50, 'auth.errors.lastName.max')
    .optional(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'auth.errors.terms.required',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'auth.errors.password.match',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.email.required')
    .email('auth.errors.email.invalid'),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'auth.errors.password.min'),
  newPassword: z
    .string()
    .min(6, 'auth.errors.password.min')
    .max(100, 'auth.errors.password.max'),
  confirmNewPassword: z
    .string()
    .min(1, 'auth.errors.confirmPassword.required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'auth.errors.password.match',
  path: ['confirmNewPassword'],
});
