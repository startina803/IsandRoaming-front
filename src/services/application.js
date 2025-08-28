import apiService from './api'

export default {
  create (data) {
    return apiService.apiAuth.post('/applications', data)
  },
  getById (id) {
    return apiService.apiAuth.get(`/applications/${id}`)
  },
  updateStatus (id, status, replyMessage) {
    return apiService.apiAuth.patch(`/applications/${id}/status`, { status, replyMessage })
  },
}
