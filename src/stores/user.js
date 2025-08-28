// stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const account = ref('')
  const nickname = ref('')
  const identity = ref('')
  const notificationCount = ref(0)
  const role = ref('user')
  const token = ref('')

  const isLoggedIn = computed(() => token.value.length > 0)
  const isAdmin = computed(() => role.value === 'admin')

  const login = data => {
    if (data.token) {
      token.value = data.token
    } else {
      console.warn('Token is missing in login data:', data)
    }
    account.value = data.account || ''
    nickname.value = data.nickname || '' // 確保 nickname 更新
    identity.value = data.identity || ''
    notificationCount.value = data.notificationCount || 0
    role.value = data.role || 'user'
    console.log('Login data updated:', { account: account.value, nickname: nickname.value, token: token.value, isLoggedIn: isLoggedIn.value })
  }

  const logout = () => {
    account.value = ''
    nickname.value = ''
    identity.value = ''
    notificationCount.value = 0
    role.value = 'user'
    token.value = ''
  }

  // ⭐️ 新增：設定未讀通知的總數
  const setUnreadCount = count => {
    // 確保 count 是有效的數字
    notificationCount.value = isNaN(Number.parseInt(count)) ? 0 : Number.parseInt(count)
  }

  // ⭐️ 新增：將未讀通知數量減一
  const decrementUnreadCount = () => {
    if (notificationCount.value > 0) {
      notificationCount.value--
    }
  }

  return {
    account,
    nickname,
    identity,
    notificationCount,
    role,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    setUnreadCount,
    decrementUnreadCount,
  }
}, {
  persist: {
    key: 'shop-user',
    pick: ['token'],
  },
})
