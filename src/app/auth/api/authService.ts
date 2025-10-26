import httpClient from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import type { LoginCredentials, SignupCredentials, AuthResponse, AuthSession } from '../types';
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY, AUTH_SESSION_KEY } from '../config';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        credentials
      );

      if (response.data.success && response.data.session) {
        this.storeSession(response.data.session);
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors,
      };
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.auth.signup,
        credentials
      );

      if (response.data.success && response.data.session) {
        this.storeSession(response.data.session);
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
        errors: error.response?.data?.errors,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  async refreshToken(): Promise<AuthSession | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.auth.refresh,
        { refreshToken }
      );

      if (response.data.success && response.data.session) {
        this.storeSession(response.data.session);
        return response.data.session;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      return null;
    }
  }

  async getCurrentUser(): Promise<AuthSession | null> {
    try {
      const response = await httpClient.get<{ session: AuthSession }>(
        API_ENDPOINTS.auth.me
      );

      if (response.data.session) {
        this.storeSession(response.data.session);
        return response.data.session;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await httpClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await httpClient.post(API_ENDPOINTS.auth.resetPassword, {
        token,
        password: newPassword,
      });
      return {
        success: true,
        message: response.data.message || 'Password reset successful',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  }

  private storeSession(session: AuthSession): void {
    localStorage.setItem(AUTH_TOKEN_KEY, session.token);
    if (session.refreshToken) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
    }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  private clearSession(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  }

  getStoredSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(AUTH_SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
