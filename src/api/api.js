import axios from 'axios'
import Cookies from 'universal-cookie'
import i18n from '@/i18n'

const BASE_URL = 'https://heavy-ride.teamqeematech.site/api/'
const cookies = new Cookies()

// Store active requests to cancel them if needed
const activeRequests = new Map()

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})
// Add token to every request
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (typeof config.data === 'string') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language || 'en'
  return config
})
// Handle token refresh or 401 errors and cleanup requests
api.interceptors.response.use(
  (response) => {
    // Clean up completed requests
    const requestKey = `${response.config.method}_${response.config.url}`
    activeRequests.delete(requestKey)
    return response
  },
  (error) => {
    // Clean up failed requests
    if (error.config) {
      const requestKey = `${error.config.method}_${error.config.url}`
      activeRequests.delete(requestKey)
    }

    if (error.response?.status === 401) {
      console.error('❌ Unauthorized (401) - Token may be expired')
      // Clear stored auth data
      cookies.remove('token', { path: '/' })
      cookies.remove('user', { path: '/' })
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  },
)

api.interceptors.request.use((config) => {
  const nextConfig = config
  nextConfig.headers = nextConfig.headers || {}
  const token = cookies.get('token') || localStorage.getItem('token')
  if (token && !nextConfig.headers.Authorization) {
    nextConfig.headers.Authorization = `Bearer ${token}`
  }

  // Add request cancellation support
  const requestKey = `${config.method}_${config.url}`
  if (activeRequests.has(requestKey)) {
    activeRequests.get(requestKey).abort()
  }

  const controller = new AbortController()
  nextConfig.signal = controller.signal
  activeRequests.set(requestKey, controller)

  return nextConfig
})

const toFormData = (data = {}) => {
  if (data instanceof FormData) return data
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          formData.append(`${key}[]`, item)
        }
      })
    } else {
      formData.append(key, value)
    }
  })
  return formData
}

const toUrlEncoded = (data = {}) => {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    params.append(key, value)
  })
  return params
}

export const authAPI = {
  login: (email, password) => api.post('login', { email, password }),
  register: (data) => api.post('register', toFormData(data)),
  sendVerificationCode: () => api.post('send-verification-code'),
  verifyCode: (payload) => {
    if (typeof payload === 'string' || typeof payload === 'number') {
      return api.post('/verify-code', { code: payload })
    }
    return api.post('/verify-code', payload)
  },
  forgotPassword: (payload) => {
    if (typeof payload === 'string') {
      return api.post('/forgot-password', { email: payload })
    }
    return api.post('/forgot-password', payload)
  },
  resetPassword: (payload) => api.post('/reset-password', payload),
  updateTokens: (payload, params = {}) => api.post('/update-tokens', payload, { params: { _method: 'PUT', ...params } }),
  updateProfile: (payload, params = {}) => api.post('/update', toFormData(payload), { params: { _method: 'PUT', ...params } }),
  deleteAccount: (params = {}) => api.delete('/delete-account', { params }),
  getProfile: () => api.get('/user'),
  logout: () => api.post('/logout'),
}

// fetch all Riders
export const getAllRiders = async (params = {}) => {
  const res = await api.get('all-riders', { params })
  return res?.data?.data || res?.data
}

//toggle riders
export const riderToggle = async (id) => {
  const res = await api.post(`toggle-rider/${id}`, null, { params: { _method: 'PUT' } })
  return res
}

//update-rider
export const updateRider = async (id, form) => {
  const formData = toFormData(form)
  const res = await api.post(`update-rider/${id}`, formData, { params: { _method: 'PUT' } })
  return res
}

export const deleteRider = async (id) => {
  const res = await api.delete(`delete-rider/${id}`)
  return res
}
//create crane
export const ceateCranse = async (form) => {
  const formData = toFormData(form)
  const res = await api.post('create-crane', formData)
  return res?.data
}

// get All Cranes
export const getAllCranse = async (params = {}) => {
  const res = await api.get('all-cranes', { params })
  return res?.data?.data || res?.data
}

// Alias for consistency (fix typo)
export const getAllCranes = getAllCranse

export const getSingleCraneById = async (id) => {
  const res = await api.get(`single-crane/${id}`)
  return res?.data
}

//update crane
export const updateCraneByID = async (id, form) => {
  const formData = toFormData(form)
  const res = await api.post(`update-crane/${id}`, formData, { params: { _method: 'PUT' } })
  return res?.data
}

//delete crane
export const deleteCraneByID = async (id) => {
  const res = await api.delete(`delete-crane/${id}`)
  return res?.data
}

// get All Drivers
export const getAllDrivers = async (params = {}) => {
  const res = await api.get('all-drivers', { params })
  return res?.data?.data || res?.data
}

//toggle driver
export const toggleDriver = async (id) => {
  const res = await api.post(`toggle-driver/${id}`, null, { params: { _method: 'PUT' } })
  return res?.data
}

//update-driver
export const updateDriver = async (id, form) => {
  const formData = toFormData(form)
  const res = await api.post(`update-driver/${id}`, formData, { params: { _method: 'PUT' } })
  return res?.data
}

//delete driver
export const deletDriver = async (id) => {
  const res = await api.delete(`delete-driver/${id}`)
  return res?.data
}

// get all admins
export const getAllAdmins = async (params = {}) => {
  const res = await api.get(`all-admins`, { params })
  return res?.data?.data || res?.data
}
// get  all-permissions

export const getAllPermissions = async () => {
  const res = await api.get(`all-permissions`)
  return res?.data
}
//create admin
export const createAdmin = async (form) => {
  const formData = toFormData(form)
  const res = await api.post('create-admin', formData)
  return res
}

//toggle admin
export const toggleAdmin = async (id) => {
  const res = await api.post(`toggle-admin/${id}`, null, { params: { _method: 'PUT' } })
  return res?.data
}

//update admin
export const updateAdmin = async (id, form) => {
  const formData = toFormData(form)
  const res = await api.post(`update-admin/${id}`, formData, { params: { _method: 'PUT' } })
  return res?.data
}

// delete admin
export const deleteAdmin = async (id) => {
  const res = await api.delete(`delete-admin/${id}`)
  return res?.data
}

export const cranesAPI = {
  getAvailable: (params) => api.get('/all-cranes', { params }),
  getById: (id) => api.get(`/single-crane/${id}`),
  create: (payload) => api.post('/create-crane', toFormData(payload)),
  toggle: ({ id, latitude, longitude, ...rest }) => {
    const params = { _method: 'PUT' }
    if (latitude !== undefined && latitude !== '') params.latitude = latitude
    if (longitude !== undefined && longitude !== '') params.longitude = longitude
    if (id !== undefined && id !== null && id !== '') params.id = id
    const queryParams = { ...params, ...rest }
    return api.post(id ? `/crane-toggle/${id}` : '/crane-toggle', null, { params: queryParams })
  },
  update: (payload = {}) => {
    const { id, params: extraParams, ...fields } = payload || {}
    const params = { _method: 'PUT', ...(extraParams || {}) }
    return api.post(id ? `/update-crane/${id}` : '/update-crane', toFormData(fields), { params })
  },
  remove: (id, config = {}) => {
    if (id !== undefined && id !== null && id !== '') {
      return api.delete(`/delete-crane/${id}`, config)
    }
    return api.delete('/delete-crane', config)
  },
}

// Settings API
export const getSettings = async () => {
  const response = await api.get('/get-settings')
  console.log(response)

  return response?.data
}

export const updateSettings = async (data) => {
  try {
    const urlEncoded = toUrlEncoded(data)
    const response = await api.post('/update-settings', urlEncoded, { params: { _method: 'PUT' } })
    return response?.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// Legacy export for backward compatibility
export const settings = getSettings

// Transactions API (Mobile)
export const transactionsAPI = {
  getMyTransactions: (params = {}) => api.get('/my-transactions', { params }),
  getMyWithdrawRequests: (params = {}) => api.get('/my-withdraw-requests', { params }),
  addWithdrawRequest: (amount) => {
    const urlEncoded = toUrlEncoded({ amount })
    return api.post('/add-withdraw-request', urlEncoded)
  },
  chargeMyWallet: (amount) => {
    const urlEncoded = toUrlEncoded({ amount })
    return api.post('/charge-my-wallet', urlEncoded)
  },
}

// Dashboard Statistics API
// Note: These methods return axios responses, access data via response.data
export const dashboardAPI = {
  // Try dashboard-stats endpoint first, fallback to individual endpoints
  getStats: async () => {
    try {
      return await api.get('/dashboard-stats')
    } catch (error) {
      // If dashboard-stats doesn't exist, return null to use individual endpoints
      console.warn('Dashboard stats endpoint not available, using individual endpoints')
      return null
    }
  },
  getRidersStats: (params = {}) => api.get('/all-riders', { params }),
  getDriversStats: (params = {}) => api.get('/all-drivers', { params }),
  getCranesStats: (params = {}) => api.get('/all-cranes', { params }),
  getAdminsStats: (params = {}) => api.get('/all-admins', { params }),
}

export default api
