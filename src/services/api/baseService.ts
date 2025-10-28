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

/**
 * Base service for API requests - localStorage functionality removed
 * All data is now managed by React Query
 */
class BaseService<T extends { id: string }> {
  protected endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    this.endpoints = endpoints;
  }

  async delay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async list(params: ListParams = {}): Promise<ListResponse<T>> {
    if (!this.endpoints.list) {
      throw new Error('List endpoint not configured');
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.filter) queryParams.append('filter', params.filter);

    const url = `${this.endpoints.list}?${queryParams.toString()}`;
    const response = await httpClient.get<ListResponse<T>>(url);
    
    return response.data;
  }

  async detail(id: string): Promise<T> {
    if (!this.endpoints.detail) {
      throw new Error('Detail endpoint not configured');
    }

    const url = typeof this.endpoints.detail === 'function' 
      ? this.endpoints.detail(id) 
      : this.endpoints.detail;
    const response = await httpClient.get<T>(url);
    return response.data;
  }

  async create(payload: Partial<T>): Promise<T> {
    if (!this.endpoints.create) {
      throw new Error('Create endpoint not configured');
    }

    const newItem = {
      ...payload,
      id: payload.id || `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(payload.hasOwnProperty('projectId') ? { projectId: (payload as any).projectId } : {}),
    } as unknown as T;

    const response = await httpClient.post<T>(this.endpoints.create, newItem);
    return response.data;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    if (!this.endpoints.update) {
      throw new Error('Update endpoint not configured');
    }

    const updatedData = {
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };

    const url = typeof this.endpoints.update === 'function' 
      ? this.endpoints.update(id) 
      : this.endpoints.update;
    const response = await httpClient.put<T>(url, updatedData);
    return response.data;
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!this.endpoints.delete) {
      throw new Error('Delete endpoint not configured');
    }

    const url = typeof this.endpoints.delete === 'function' 
      ? this.endpoints.delete(id) 
      : this.endpoints.delete;
    await httpClient.delete(url);
    
    return { success: true, id };
  }

  async bulkUpdate(items: T[]): Promise<T[]> {
    if (!this.endpoints.base) {
      throw new Error('Base endpoint not configured for bulk update');
    }

    const response = await httpClient.put<T[]>(`${this.endpoints.base}/bulk`, items);
    return response.data;
  }
}

export default BaseService;
