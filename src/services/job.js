// src/services/job.js
// ⭐ 修正：從中央的 api.js 服務檔案匯入
import apiService from './api'

export default {
  /**
   * 取得特定地區的工作機會 (公開)
   */
  getJobsByCounty (countyName) {
    // ⭐ 使用 apiService.api (不需要 token)
    // 並透過 params 傳遞地區名稱
    return apiService.api.get('/jobs', {
      params: {
        location: countyName,
      },
    })
  },

  /**
   * 取得單一工作機會的詳細資訊 (公開)
   */
  getPublicJobById (id) {
    // ⭐ 使用 apiService.api (不需要 token)
    return apiService.api.get(`/jobs/public/${id}`)
  },

  /**
   * 取得自己發布的單一工作機會 (私人)
   */
  getMyJobById (id) {
    // ⭐ 使用 apiService.apiAuth (需要 token)
    return apiService.apiAuth.get(`/jobs/${id}`)
  },

  /**
   * 申請一個工作機會 (僅限背包客)
   */
  applyForJob (id, data) {
    // ⭐ 使用 apiService.apiAuth 確保帶有 token
    // 注意：這裡我們假設申請的端點是在 job 路由底下
    return apiService.apiAuth.post(`/jobs/${id}/apply`, data)
  },

  /**
   * 新增一個工作機會 (僅限旅宿業者)
   */
  createJob (formData) {
    // ⭐ 使用 apiService.apiAuth 確保帶有 token
    return apiService.apiAuth.post('/jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 編輯指定工作機會 (僅限旅宿業者，且為發布者)
   */
  updateJob (id, formData) {
    // ⭐ 使用 apiService.apiAuth 確保帶有 token
    return apiService.apiAuth.patch(`/jobs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 取得所有公開的工作機會
   */
  getAllJobs (params) {
    // ⭐ 使用 apiService.api (不需要 token)
    return apiService.api.get('/jobs', { params })
  },

  /**
   * 取得目前登入旅宿業者發布的所有工作 (私人)
   */
  getMyJobs () {
    // ⭐ 使用 apiService.apiAuth 確保帶有 token
    return apiService.apiAuth.get('/jobs/my')
  },
}
