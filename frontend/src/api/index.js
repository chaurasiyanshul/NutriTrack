import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh/', { refresh: refreshToken })
          localStorage.setItem('access_token', res.data.access)
          if (res.data.refresh) {
            localStorage.setItem('refresh_token', res.data.refresh)
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`
          return API(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth APIs ───
export const authAPI = {
  register: (data) => API.post('/auth/register/', data),
  login: (data) => API.post('/auth/login/', data),
  getProfile: () => API.get('/auth/profile/'),
  updateProfile: (data) => API.put('/auth/profile/', data),
}

// ─── Food APIs ───
export const foodAPI = {
  list: (params) => API.get('/foods/', { params }),
  detail: (id) => API.get(`/foods/${id}/`),
  categories: () => API.get('/foods/categories/'),
}

// ─── Meal APIs ───
export const mealAPI = {
  list: (date) => API.get('/meals/', { params: { date } }),
  create: (data) => API.post('/meals/', data),
  delete: (id) => API.delete(`/meals/${id}/`),
  addItem: (mealId, data) => API.post(`/meals/${mealId}/items/`, data),
  removeItem: (mealId, itemId) => API.delete(`/meals/${mealId}/items/${itemId}/`),
}

// ─── Nutrition APIs ───
export const nutritionAPI = {
  daily: (date) => API.get('/nutrition/daily/', { params: { date } }),
  weekly: () => API.get('/nutrition/weekly/'),
  monthly: () => API.get('/nutrition/monthly/'),
  recommendations: (date) => API.get('/nutrition/recommendations/', { params: { date } }),
}

export default API
