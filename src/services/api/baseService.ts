import localStorageService from '../storage/localStorage';
import httpClient from './httpClient';

interface ListParams {
  page?: number;
  limit?: number;
  filter?: string;
}

interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface DeleteResponse {
  success: boolean;
  id: string;
}

interface Endpoints {
  base?: string;
  list?: string;
  create?: string;
  detail?: (id: string) => string;
  update?: (id: string) => string;
  delete?: (id: string) => string;
  [key: string]: any;
}

type StorageMode = 'http' | 'localStorage' | 'hybrid';

class BaseService<T extends { id: string }> {
  protected storageKey: string;
  protected endpoints: Endpoints;
  protected mode: StorageMode = 'hybrid'; // Mode par défaut: essaye HTTP puis fallback localStorage
  protected useBackend: boolean = true; // Peut être désactivé par configuration

  constructor(storageKey: string, endpoints: Endpoints, mode: StorageMode = 'hybrid') {
    this.storageKey = storageKey;
    this.endpoints = endpoints;
    this.mode = mode;
  }

  /**
   * Configure si le service doit utiliser le backend ou localStorage uniquement
   */
  setBackendEnabled(enabled: boolean): void {
    this.useBackend = enabled;
  }

  /**
   * Vérifie si le backend est disponible
   */
  private shouldUseBackend(): boolean {
    return this.useBackend && this.mode !== 'localStorage' && httpClient.checkIsOnline();
  }

  async delay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Synchronise les données localStorage avec le backend
   */
  async syncToBackend(item: T): Promise<void> {
    if (this.shouldUseBackend() && this.endpoints.update) {
      try {
        const url = typeof this.endpoints.update === 'function' 
          ? this.endpoints.update(item.id) 
          : this.endpoints.update;
        await httpClient.put(url, item);
      } catch (error) {
        console.warn('Failed to sync to backend, data saved in localStorage only', error);
      }
    }
  }

  async list(params: ListParams = {}): Promise<ListResponse<T>> {
    if (this.shouldUseBackend() && this.endpoints.list) {
      try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.filter) queryParams.append('filter', params.filter);

        const url = `${this.endpoints.list}?${queryParams.toString()}`;
        const response = await httpClient.get<ListResponse<T>>(url);
        
        // Synchronise avec localStorage pour le cache
        if (this.mode === 'hybrid') {
          localStorageService.set(this.storageKey, response.data.data);
        }
        
        return response.data;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        // Fallback to localStorage in hybrid mode
        if (this.mode === 'hybrid') {
          return this.listFromLocalStorage(params);
        }
        throw error;
      }
    }

    // Use localStorage directly
    return this.listFromLocalStorage(params);
  }

  private async listFromLocalStorage(params: ListParams = {}): Promise<ListResponse<T>> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    
    let filtered = items;
    if (params.filter) {
      filtered = items.filter((item: T) => 
        JSON.stringify(item).toLowerCase().includes(params.filter!.toLowerCase())
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    };
  }

  async detail(id: string): Promise<T> {
    if (this.shouldUseBackend() && this.endpoints.detail) {
      try {
        const url = typeof this.endpoints.detail === 'function' 
          ? this.endpoints.detail(id) 
          : this.endpoints.detail;
        const response = await httpClient.get<T>(url);
        return response.data;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        if (this.mode === 'hybrid') {
          return this.detailFromLocalStorage(id);
        }
        throw error;
      }
    }

    return this.detailFromLocalStorage(id);
  }

  private async detailFromLocalStorage(id: string): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const item = items.find((i: T) => i.id === id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    return item;
  }

  async create(payload: Partial<T>): Promise<T> {
    const newItem = {
      ...payload,
      id: payload.id || `${this.storageKey}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;

    if (this.shouldUseBackend() && this.endpoints.create) {
      try {
        const response = await httpClient.post<T>(this.endpoints.create, newItem);
        const createdItem = response.data;
        
        // Synchronise avec localStorage pour le cache
        if (this.mode === 'hybrid') {
          const items = localStorageService.get(this.storageKey) || [];
          items.push(createdItem);
          localStorageService.set(this.storageKey, items);
        }
        
        return createdItem;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        if (this.mode === 'hybrid') {
          return this.createInLocalStorage(newItem);
        }
        throw error;
      }
    }

    return this.createInLocalStorage(newItem);
  }

  private async createInLocalStorage(newItem: T): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    items.push(newItem);
    localStorageService.set(this.storageKey, items);
    return newItem;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    const updatedData = {
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };

    if (this.shouldUseBackend() && this.endpoints.update) {
      try {
        const url = typeof this.endpoints.update === 'function' 
          ? this.endpoints.update(id) 
          : this.endpoints.update;
        const response = await httpClient.put<T>(url, updatedData);
        const updatedItem = response.data;
        
        // Synchronise avec localStorage pour le cache
        if (this.mode === 'hybrid') {
          const items = localStorageService.get(this.storageKey) || [];
          const index = items.findIndex((i: T) => i.id === id);
          if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            localStorageService.set(this.storageKey, items);
          }
        }
        
        return updatedItem;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        if (this.mode === 'hybrid') {
          return this.updateInLocalStorage(id, updatedData);
        }
        throw error;
      }
    }

    return this.updateInLocalStorage(id, updatedData);
  }

  private async updateInLocalStorage(id: string, payload: Partial<T>): Promise<T> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const index = items.findIndex((i: T) => i.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = {
      ...items[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    localStorageService.set(this.storageKey, items);
    
    return items[index];
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (this.shouldUseBackend() && this.endpoints.delete) {
      try {
        const url = typeof this.endpoints.delete === 'function' 
          ? this.endpoints.delete(id) 
          : this.endpoints.delete;
        await httpClient.delete(url);
        
        // Synchronise avec localStorage pour le cache
        if (this.mode === 'hybrid') {
          const items = localStorageService.get(this.storageKey) || [];
          const filtered = items.filter((i: T) => i.id !== id);
          localStorageService.set(this.storageKey, filtered);
        }
        
        return { success: true, id };
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        if (this.mode === 'hybrid') {
          return this.deleteFromLocalStorage(id);
        }
        throw error;
      }
    }

    return this.deleteFromLocalStorage(id);
  }

  private async deleteFromLocalStorage(id: string): Promise<DeleteResponse> {
    await this.delay();
    const items = localStorageService.get(this.storageKey) || [];
    const filtered = items.filter((i: T) => i.id !== id);
    
    if (filtered.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    localStorageService.set(this.storageKey, filtered);
    
    return { success: true, id };
  }

  async bulkUpdate(items: T[]): Promise<T[]> {
    if (this.shouldUseBackend() && this.endpoints.base) {
      try {
        const response = await httpClient.put<T[]>(`${this.endpoints.base}/bulk`, items);
        const updatedItems = response.data;
        
        // Synchronise avec localStorage pour le cache
        if (this.mode === 'hybrid') {
          localStorageService.set(this.storageKey, updatedItems);
        }
        
        return updatedItems;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage', error);
        if (this.mode === 'hybrid') {
          return this.bulkUpdateInLocalStorage(items);
        }
        throw error;
      }
    }

    return this.bulkUpdateInLocalStorage(items);
  }

  private async bulkUpdateInLocalStorage(items: T[]): Promise<T[]> {
    await this.delay();
    localStorageService.set(this.storageKey, items);
    return items;
  }
}

export default BaseService;
