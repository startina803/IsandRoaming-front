// src/services/api.js
import axios from 'axios'
import userService from '@/services/user'
import { useUserStore } from '@/stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// axios 攔截器
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

apiAuth.interceptors.response.use(res => res, async error => {
  if (error.response
    && error.response.status === 400
    && error.response.data.message === 'token 已過期'
    && error.config.url !== '/user/refresh'
  ) {
    const user = useUserStore()
    try {
      const { data } = await userService.refresh()
      user.token = data.token
      error.config.headers.Authorization = `Bearer ${data.token}`
      return axios(error.config)
    } catch {
      user.logout()
    }
  }
  throw error
})

export default { api, apiAuth }
