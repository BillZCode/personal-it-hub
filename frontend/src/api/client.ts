import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';
import { useAuthStore } from '../store/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // When sending FormData, delete Content-Type so Axios & the browser
        // automatically append the correct multipart/form-data boundary
        if (config.data instanceof FormData) {
          if (config.headers) {
            if (typeof config.headers.delete === 'function') {
              config.headers.delete('Content-Type');
              config.headers.delete('content-type');
            } else {
              delete (config.headers as Record<string, unknown>)['Content-Type'];
              delete (config.headers as Record<string, unknown>)['content-type'];
            }
          }
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const isLoginRequest = originalRequest.url?.includes('/login');

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch {
            this.clearAuth();
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            if (currentPath.startsWith('/admin') && !currentPath.includes('/login')) {
              window.location.href = '/admin/login';
            } else if (currentPath.startsWith('/drive') && !currentPath.includes('/login')) {
              window.location.href = '/drive/login';
            }
            return Promise.reject(error);
          }
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Permintaan koneksi melebihi batas waktu (timeout)' : error.message) || 'Terjadi kesalahan koneksi',
          code: error.response?.data?.code || error.code,
          statusCode: error.response?.status || (error.code === 'ECONNABORTED' ? 408 : 500),
          details: error.response?.data?.details,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    await this.client.post('/auth/refresh');
  }

  private clearAuth(): void {
    try {
      useAuthStore.getState().logout();
      localStorage.removeItem('auth-storage');
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public async get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, { params, ...config });
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
export default api;