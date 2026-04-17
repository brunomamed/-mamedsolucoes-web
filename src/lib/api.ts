import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', { email, password, name });
    return response.data;
  }

  // Service Orders endpoints
  async getServiceOrders() {
    const response = await this.client.get('/service-orders');
    return response.data;
  }

  async getServiceOrder(id: string) {
    const response = await this.client.get(`/service-orders/${id}`);
    return response.data;
  }

  async createServiceOrder(data: any) {
    const response = await this.client.post('/service-orders', data);
    return response.data;
  }

  async updateServiceOrder(id: string, data: any) {
    const response = await this.client.put(`/service-orders/${id}`, data);
    return response.data;
  }

  async deleteServiceOrder(id: string) {
    const response = await this.client.delete(`/service-orders/${id}`);
    return response.data;
  }

  // Parts endpoints
  async getParts() {
    const response = await this.client.get('/parts');
    return response.data;
  }

  async createPart(data: any) {
    const response = await this.client.post('/parts', data);
    return response.data;
  }

  async updatePart(id: string, data: any) {
    const response = await this.client.put(`/parts/${id}`, data);
    return response.data;
  }

  async deletePart(id: string) {
    const response = await this.client.delete(`/parts/${id}`);
    return response.data;
  }

  // Stock endpoints
  async getStock() {
    const response = await this.client.get('/stock');
    return response.data;
  }

  async recordStockMovement(data: any) {
    const response = await this.client.post('/stock/movements', data);
    return response.data;
  }

  async getStockMovements() {
    const response = await this.client.get('/stock/movements');
    return response.data;
  }

  // Reports endpoints
  async generateServiceOrderPDF(osId: string) {
    const response = await this.client.get(`/reports/service-order/${osId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async generateMonthlyBackup() {
    const response = await this.client.get('/reports/backup', {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
