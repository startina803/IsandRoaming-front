// src/services/resume.js
import apiService from './api'

export default {
  // 獲取我的個人履歷
  getMyResume () {
    return apiService.apiAuth.get('/resumes/my')
  },
  // ⭐️ 新增此功能，用來第一次建立個人履歷
  createResume (resumeData) {
    return apiService.apiAuth.post('/resumes', resumeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  // 更新個人履歷
  updateResume (id, resumeData) {
    return apiService.apiAuth.patch(`/resumes/${id}`, resumeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  // 獲取所有公開的履歷
  getPublicResumes () {
    return apiService.apiAuth.get('/resumes')
  },
  // 申請某個履歷（例如換宿）
  applyResume (resumeId) {
    return apiService.apiAuth.post(`/resumes/apply/${resumeId}`, {})
  },
  // ⭐️ 新增：公開取得指定 ID 的履歷
  getPublicResumeById (resumeId) {
    // 這是一個公開的路由，所以使用不需要驗證的 apiService.api
    // 後端路由是 /public/:id，這裡的 id 是指「履歷的 ID」
    return apiService.api.get(`/resumes/public/${resumeId}`)
  },
  // ⭐️ 新增：公開取得指定「使用者 ID」的履歷
  getPublicResumeByUserId (userId) {
    // 這是一個公開的路由，所以使用不需要驗證的 apiService.api
    return apiService.api.get(`/resumes/public/user/${userId}`)
  },
}
