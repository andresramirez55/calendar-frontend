import axios from 'axios';

// Configuración base de la API
const getApiUrl = () => {
  // Si estamos en desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Por defecto, usar el backend en Railway
  return 'https://calendar-backend-production.up.railway.app';
};

// Log para debug
console.log('API URL:', getApiUrl());
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores y respuestas HTML
api.interceptors.response.use(
  (response) => {
    // Verificar si la respuesta es HTML en lugar de JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      console.warn('Backend not available, using demo mode');
      throw new Error('BACKEND_NOT_AVAILABLE');
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Manejar errores específicos
    if (error.response?.status === 404) {
      throw new Error('El servicio no está disponible. Verifica que el backend esté funcionando.');
    } else if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta más tarde.');
    } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      throw new Error('Sin conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

// Servicios de eventos
export const eventService = {
  // Obtener todos los eventos
  getAllEvents: async (params = {}) => {
    const response = await api.get('/api/v1/events/', { params });
    return response.data;
  },

  // Obtener evento por ID
  getEventById: async (id) => {
    const response = await api.get(`/api/v1/events/${id}`);
    return response.data;
  },

  // Crear nuevo evento
  createEvent: async (eventData) => {
    const response = await api.post('/api/v1/events/', eventData);
    return response.data;
  },

  // Actualizar evento
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/api/v1/events/${id}`, eventData);
    return response.data;
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/v1/events/${id}`);
    return response.data;
  },

  // Buscar eventos
  searchEvents: async (query) => {
    const response = await api.get('/api/v1/events/', {
      params: { search: query }
    });
    return response.data;
  },

  // Obtener eventos por fecha
  getEventsByDate: async (date) => {
    const response = await api.get('/api/v1/events/', {
      params: { date }
    });
    return response.data;
  },

  // Obtener eventos por rango de fechas
  getEventsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/api/v1/events/', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },
};

// Servicios móviles
export const mobileService = {
  // Obtener eventos de hoy
  getTodayEvents: async () => {
    const response = await api.get('/api/mobile/events/today');
    return response.data;
  },

  // Obtener eventos próximos
  getUpcomingEvents: async () => {
    const response = await api.get('/api/mobile/events/upcoming');
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/api/mobile/stats');
    return response.data;
  },
};

// Health check
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
