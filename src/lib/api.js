const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('access_token')
}

export function setToken(token) {
  localStorage.setItem('access_token', token)
}

export function removeToken() {
  localStorage.removeItem('access_token')
}

async function request(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    ...options.headers,
  }

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    body: options.body instanceof FormData 
      ? options.body 
      : options.body 
        ? JSON.stringify(options.body) 
        : undefined,
  })

  if (response.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
    const detail = Array.isArray(error.message)
      ? error.message.map((e) => e.message).join(', ')
      : error.message
    throw new Error(detail || 'An error occurred')
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response
}

// Auth API
export const authApi = {
  register: (username, password) => 
    request('/users', { 
      method: 'POST', 
      body: { username, password },
      skipAuth: true 
    }),
  
  login: async (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    
    const response = await request('/users/login', { 
      method: 'POST', 
      body: formData,
      skipAuth: true 
    })
    
    if (response.access_token) {
      setToken(response.access_token)
    }
    
    return response
  },
  
  getMe: () => request('/users/me'),
  
  updateMe: (data) => request('/users/me', { method: 'PATCH', body: data }),
}

// Tasks API
export const tasksApi = {
  list: () => request('/tasks'),
  
  create: (uri) => request('/tasks', { method: 'POST', body: { uri } }),
  
  get: (taskId) => request(`/tasks/${taskId}`),
  
  cancel: (taskId) => request(`/tasks/${taskId}/cancel`, { method: 'POST' }),
  
  getVideoUrl: (taskId) => `${API_BASE}/tasks/${taskId}/video`,
  
  getAudioUrl: (taskId) => `${API_BASE}/tasks/${taskId}/audio`,
  
  getTranscript: (taskId) => request(`/tasks/${taskId}/transcript`),
}

// Convenience export
export const api = {
  ...authApi,
  ...tasksApi,
}
