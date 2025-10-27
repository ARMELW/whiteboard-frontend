import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * HTTP Client pour les appels API vers le backend
 * Fournit une interface centralisée pour toutes les requêtes HTTP
 */
class HttpClient {
  private client: AxiosInstance;
  private isOnline: boolean = true;

  constructor(config: HttpClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
    this.setupNetworkStatusListener();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('whiteboard_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Gestion centralisée des erreurs
        if (error.response) {
          // Le serveur a répondu avec un code d'erreur
          console.error('HTTP Error:', error.response.status, error.response.data);
        } else if (error.request) {
          // La requête a été faite mais pas de réponse
          console.error('Network Error: No response received');
          this.isOnline = false;
        } else {
          // Erreur lors de la configuration de la requête
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private setupNetworkStatusListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('Network: Back online');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('Network: Offline');
      });
    }
  }

  /**
   * Vérifie si le client est en ligne
   */
  public checkIsOnline(): boolean {
    return this.isOnline && navigator.onLine;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * Test de connexion au backend
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/health', { timeout: 5000 });
      this.isOnline = true;
      return true;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }
}

// Instance singleton du client HTTP
export const httpClient = new HttpClient();

export default httpClient;
