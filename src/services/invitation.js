import apiService from './api'

export default {
  create (data) {
    // Map frontend data keys (targetId, jobId) to backend keys (to, job)
    const payload = {
      to: data.targetId,
      job: data.jobId,
      message: data.message,
    }
    return apiService.apiAuth.post('/invitations', payload)
  },
  checkStatusToUser (backpackerId) {
    return apiService.apiAuth.get(`/invitations/check/${backpackerId}`)
  },
  getById (id) {
    return apiService.apiAuth.get(`/invitations/${id}`)
  },
  updateStatus (id, status, replyMessage) {
    return apiService.apiAuth.patch(`/invitations/${id}/status`, { status, replyMessage })
  },
}
