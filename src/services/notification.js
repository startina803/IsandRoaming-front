import apiService from './api'

export default {
  getMyNotifications() {
    return apiService.apiAuth.get('/notifications')
  },

  markAsRead(id) {
    return apiService.apiAuth.patch(`/notifications/${id}/read`)
  },

  deleteNotification(id) {
    return apiService.apiAuth.delete(`/notifications/${id}`)
  },

  // ⭐️ 新增：取得未讀通知數量
  getUnreadCount() {
    return apiService.apiAuth.get('/notifications/unread-count')
  },
}
