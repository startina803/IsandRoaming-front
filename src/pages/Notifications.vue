<template>
  <div class="notifications-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <h1 class="page-title text-primary">通知中心</h1>

          <!-- Loading State -->
          <div v-if="loading" class="text-center pa-12">
            <v-progress-circular color="primary" indeterminate size="64" />
            <p class="mt-4">正在載入通知...</p>
          </div>

          <!-- Error State -->
          <v-alert v-else-if="error" prominent type="error">{{ error }}</v-alert>

          <!-- Notifications List -->
          <div v-else-if="notifications.length > 0">
            <div
              v-for="(notification, index) in notifications"
              :key="notification._id"
              class="notification-card"
              :class="{ unread: !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                <v-icon :color="!notification.read ? 'primary' : 'grey-darken-1'" size="28">
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </div>
              <div class="notification-content">
                <p class="notification-text">
                  {{ notification.content }}
                </p>
                <span class="notification-time">
                  {{ new Date(notification.createdAt).toLocaleString() }}
                </span>
              </div>
              <div class="notification-action">
                <v-btn icon size="small" variant="text" @click.stop.prevent="deleteNotification(notification._id, index)">
                  <v-icon color="grey">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">刪除通知</v-tooltip>
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <v-icon color="grey-lighten-1" size="64">mdi-bell-off-outline</v-icon>
            <p class="mt-4 text-h6 text-grey">目前沒有任何通知</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import notificationService from '@/services/notification'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const createSnackbar = useSnackbar()
  const notifications = ref([])
  const loading = ref(true)
  const error = ref(null)

  const user = useUserStore()

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getMyNotifications()
      // ⭐️ 修正：直接使用後端回傳的列表和未讀數量
      notifications.value = data.result.list
      // 使用後端提供的權威未讀數量來更新 store，更準確且高效
      user.setUnreadCount(data.result.unreadCount)
    } catch (error_) {
      console.log(error_)
      error.value = '載入通知失敗'
      createSnackbar({ text: error_.response?.data?.message || '載入通知失敗', snackbarProps: { color: 'error' } })
    } finally {
      loading.value = false
    }
  }

  const getNotificationIcon = type => {
    if (type === 'invitation') return 'mdi-email-fast-outline'
    if (type === 'application_status') return 'mdi-account-arrow-left-outline'
    return 'mdi-bell-outline'
  }

  const getNotificationLink = notification => {
    if (notification.related?.id) {
      if (notification.type === 'invitation') {
        // ⭐️ 修正：從已填充的物件中取得 _id
        return `/invitations/${notification.related.id._id}`
      } else if (notification.type === 'application_status' && notification.related.model === 'Application') {
        // ⭐️ 修正：從已填充的物件中取得 _id
        return `/applications/${notification.related.id._id}`
      }
    }
    return null // Return null if no link, so the item is not a link
  }

  const handleNotificationClick = async notification => {
    // Mark as read
    if (!notification.read) {
      try {
        await notificationService.markAsRead(notification._id)
        notification.read = true // Update UI immediately
        // ⭐️ 標示為已讀後，將 store 中的數量減 1
        user.decrementUnreadCount()
      } catch (error_) {
        console.error('Failed to mark notification as read', error_)
      }
    }
    // Navigate if a link exists
    const link = getNotificationLink(notification)
    if (link && link !== '#') {
      router.push(link)
    }
  }

  const deleteNotification = async (id, index) => {
    const wasUnread = !notifications.value[index].read
    try {
      await notificationService.deleteNotification(id)
      notifications.value.splice(index, 1)
      // ⭐️ 如果刪除的是未讀訊息，將 store 中的數量減 1
      if (wasUnread) user.decrementUnreadCount()

      createSnackbar({ text: '通知已刪除', snackbarProps: { color: 'success' } })
    } catch (error_) {
      createSnackbar({ text: error_.response?.data?.message || '刪除失敗', snackbarProps: { color: 'error' } })
    }
  }

  onMounted(fetchNotifications)
</script>

<style scoped>
/* 整個通知頁面的背景 */
.notifications-page {
  background-color: #f4f7f9;
  min-height: 100vh;
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 24px;
  padding-top: 24px;
}

/* 通知卡片 */
.notification-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border-left: 5px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

/* 滑鼠懸停效果 */
.notification-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

/* 未讀通知的樣式 */
.notification-card.unread {
  border-left-color: #ea914e; /* 使用您專案的主題橘色 */
  background-color: #fffaf0;
}

.notification-card.unread .notification-text {
  font-weight: 600;
}

/* 圖示樣式 */
.notification-icon {
  margin-right: 20px;
  flex-shrink: 0;
}

/* 通知內容 */
.notification-content {
  flex-grow: 1;
}

.notification-text {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

/* 時間戳 */
.notification-time {
  font-size: 0.875em;
  color: #888;
  margin-top: 4px;
  display: block;
}

/* 卡片右側的動作/指示符號 */
.notification-action {
  margin-left: 16px;
}

.empty-state {
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  padding: 48px;
}
</style>
