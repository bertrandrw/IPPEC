import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL configuration
// const BASE_URL = 'https://health-agaba-be.onrender.com/api/v1';
const BASE_URL = 'http://localhost:30000/api/v1';

// Export BASE_URL for other files that need it
export { BASE_URL };

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mediflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API response interface
export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Auth API endpoints
export const authAPI = {
  login: async (emailOrPhone: string, password: string): Promise<ApiResponse<{
    user: {
      id: string;
      email: string;
      phone: string;
      role: string;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  }>> => {
    const response = await api.post('/auth/login', {
      emailOrPhone,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    phone: string;
    password: string;
    role: string;
    fullName: string;
    dateOfBirth: string;
    sex: string;
    nid: string;
  }): Promise<ApiResponse<{
    id: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }>> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Medicine API endpoints
export const medicineAPI = {
  search: async (query: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/medicines?search=${encodeURIComponent(query)}`);
    // The backend returns { data: { data: [ ...medicines ], meta: ... }, ... }
    return {
      ...response.data,
      data: response.data.data?.data || []
    };
  },
};

// Pharmacy API endpoints
export const pharmacyAPI = {
  search: async (params: {
    medicineId: string;
    latitude: number;
    longitude: number;
    limit?: number;
    insuranceCompanyId?: string;
  }): Promise<ApiResponse<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    distance: number;
  }[]>> => {
    const queryParams = new URLSearchParams({
      medicineId: params.medicineId,
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.insuranceCompanyId && { insuranceCompanyId: params.insuranceCompanyId }),
    });
    
    const response = await api.get(`/pharmacies/search?${queryParams.toString()}`);
    return response.data;
  },

  findPharmaciesForPrescription: async (params: {
    prescriptionId: string;
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    distance: number;
  }[]>> => {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
    });
    
    const response = await api.get(`/prescriptions/${params.prescriptionId}/find-pharmacies?${queryParams.toString()}`);
    return response.data;
  },

  sendPrescriptionToPharmacy: async (params: {
    prescriptionId: string;
    pharmacyId: string;
    orderItems: Array<{
      medicineId: string;
      quantity: number;
    }>;
  }): Promise<ApiResponse<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    pharmacyId: string;
    orderItems: Array<{
      id: string;
      quantity: number;
      orderId: string;
      medicineId: string;
      prescriptionId: string;
      medicine: {
        id: string;
        brandName: string;
        genericName: string;
        manufacturer: string;
        price: string;
        createdAt: string;
      };
    }>;
    pharmacy: {
      name: string;
    };
  }>> => {
    const response = await api.post('/orders', {
      pharmacyId: params.pharmacyId,
      prescriptionId: params.prescriptionId,
      orderItems: params.orderItems,
    });
    return response.data;
  },
};

// Orders API endpoints
export const ordersAPI = {
  getPatientOrders: async (): Promise<ApiResponse<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    pharmacyId: string;
    pharmacy: {
      name: string;
    };
    _count: {
      orderItems: number;
    };
  }[]>> => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Pharmacist order endpoints
  getPharmacyOrders: async (): Promise<ApiResponse<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    pharmacyId: string;
    patient: {
      fullName: string;
    };
    _count: {
      orderItems: number;
    };
  }[]>> => {
    const response = await api.get('/orders/pharmacy');
    return response.data;
  },

  getPharmacyOrderDetails: async (orderId: string): Promise<ApiResponse<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    pharmacyId: string;
    patient: {
      id: string;
      userId: string;
      fullName: string;
      dateOfBirth: string;
      sex: string;
      nid: string;
      insuranceCompanyId: string | null;
      insurancePolicyNumber: string | null;
    };
    orderItems: Array<{
      id: string;
      quantity: number;
      orderId: string;
      medicineId: string;
      prescriptionId: string;
      medicine: {
        id: string;
        brandName: string;
        genericName: string;
        manufacturer: string;
        price: string;
        createdAt: string;
      };
      prescription: {
        id: string;
        createdAt: string;
        patientId: string;
        doctorId: string;
        hospitalId: string;
        chiefComplaints: string;
        findingsOnExam: string;
        investigations: string | null;
        advice: string;
        followUpDate: string;
        status: string;
        dispensedById: string | null;
        dispensedAt: string | null;
        doctor: {
          fullName: string;
          specialty: string;
          credentials: string;
          hospital: {
            name: string;
          };
        };
      };
    }>;
    prescription: {
      id: string;
      createdAt: string;
      doctor: {
        fullName: string;
        specialty: string;
        credentials: string;
        hospital: {
          name: string;
        };
      };
    };
  }>> => {
    const response = await api.get(`/orders/pharmacy/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    pharmacyId: string;
  }>> => {
    const response = await api.patch(`/orders/pharmacy/${orderId}/status`, { status });
    return response.data;
  },
};

// Generic API methods
export const apiClient = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.patch(url, data, config);
    return response.data;
  },

  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete(url, config);
    return response.data;
  },
};

// Private Orders API
export const privateOrdersAPI = {
  // Get all available private medicines
  getPrivateMedicines: async () => {
    return apiClient.get('/private-medicines');
  },

  // Get private medicines by category
  getPrivateMedicinesByCategory: async (category: string) => {
    return apiClient.get(`/private-medicines?category=${category}`);
  },

  // Search private medicines
  searchPrivateMedicines: async (query: string) => {
    return apiClient.get(`/private-medicines/search?q=${encodeURIComponent(query)}`);
  },

  // Place a private order
  createPrivateOrder: async (orderData: any) => {
    return apiClient.post('/private-orders', orderData);
  },

  // Get user's private orders
  getMyPrivateOrders: async () => {
    return apiClient.get('/private-orders/my-orders');
  },

  // Get private order by ID
  getPrivateOrderById: async (orderId: string) => {
    return apiClient.get(`/private-orders/${orderId}`);
  },

  // Update private order status
  updatePrivateOrderStatus: async (orderId: string, status: string) => {
    return apiClient.patch(`/private-orders/${orderId}/status`, { status });
  },

  // Cancel private order
  cancelPrivateOrder: async (orderId: string) => {
    return apiClient.delete(`/private-orders/${orderId}`);
  },

  // Track private order
  trackPrivateOrder: async (trackingNumber: string) => {
    return apiClient.get(`/private-orders/track/${trackingNumber}`);
  }
};

export default api;