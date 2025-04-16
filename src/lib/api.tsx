
// Circulars data
/*
export const fetchCirculars = async () => {
    return [
      { id: 1, title: 'Math Tutor Needed', user_email: 'parent@example.com' },
      { id: 2, title: 'Science Homework Help', user_email: 'student@example.com' },
    ]
  }

*/
  import axios from 'axios';

  export interface Circular {
    id: number;
    title: string;
    description?: string;
    user_email: string;
    //created_at: string;
  }
  // Configure axios instance
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Add request interceptor for auth token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  // Auth API
  export const authApi = {
    signup: (email: string, password: string) =>
      api.post('/signup', { email, password }),
    login: (email: string, password: string) =>
      api.post('/login', { email, password }),
  };
  
  // Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


  export const circularApi = {
    create: (title: string, description?: string) => 
      api.post('/circulars', { title, description }),
    
    getAll: () => api.get('/circulars'),
    
    getById: (id: number) => api.get(`/circulars/${id}`),
  };
  
  // Bids API
  export const bidsApi = {
    create: (circularId: number, proposal: string) =>
      api.post('/bids', { circular_id: circularId, proposal }),
    getByCircular: (circularId: number) =>
      api.get(`/bids?circular_id=${circularId}`),
  };
  
  export default api;


/*
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Example usage:
export const fetchCirculars = async () => {
  const response = await api.get('/circulars');
  return response.data;
};

*/