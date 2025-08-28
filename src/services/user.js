import apiService from './api'

const create = data => {
  return apiService.api.post('/user', data)
}

const login = data => {
  return apiService.api.post('/user/login', data)
}

const logout = () => {
  return apiService.apiAuth.delete('/user/logout')
}

const profile = () => {
  return apiService.apiAuth.get('/user/profile')
}

const refresh = () => {
  return apiService.apiAuth.patch('/user/refresh')
}

/**
 * 公開取得所有背包客的個人檔案
 * @param {string | null} location - 要篩選的地點，可為 null
 * @param {object} [options] - 傳遞給 axios 的額外選項，例如 AbortSignal
 * @returns {Promise}
 */
const getPublicBackpackers = (location, options) => {
  const params = {}
  if (location) {
    params.location = location
  }
  // 這是一個公開的路由，所以使用不需要驗證的 apiService.api
  return apiService.api.get('/user/public-backpackers', { params, ...options })
}

export default {
  create,
  login,
  logout,
  profile,
  refresh,
  getPublicBackpackers,
}
