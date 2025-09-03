<!-- layouts/default.vue -->
<template>
  <v-app-bar color="primary" :height="80">
    <v-container class="d-flex align-center custom-container">
      <v-img class="mr-2" max-height="40" max-width="40" src="@/assets/logo.png" />
      <v-app-bar-title class="d-flex align-center brand-title" :class="{ 'cursor-pointer': true }" @click="router.push('/')">
        島嶼漫遊
      </v-app-bar-title>
      <div class="navitem1">
        <template v-for="item of navItems1" :key="item.to">
          <v-btn :to="item.to">{{ item.title }}</v-btn>
        </template>
      </div>
      <div class="navitem2" style="margin-left: auto;">
        <template v-if="!user.isLoggedIn">
          <v-btn
            color="#ea914e"
            :style="{ minWidth: buttonWidth + 'px', textAlign: 'center' }"
            :to="'/login'"
            variant="elevated"
          >
            會員登入
          </v-btn>
        </template>
        <v-menu v-else :key="user.isLoggedIn">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="d-flex align-center custom-menu-btn"
              color="secondary"
              :style="{ minWidth: buttonWidth + 'px', textAlign: 'center' }"
            >
              <v-icon v-if="user.role === 'host'" class="mr-1">mdi-home</v-icon>
              <v-icon v-else class="mr-2">mdi-account</v-icon>
              <!-- ⭐️ 加上 v-badge 來顯示未讀通知數量 -->
              <v-badge
                color="red"
                :content="user.notificationCount"
                :model-value="user.notificationCount > 0"
                offset-x="-8"
                offset-y="-8"
              >
                <span class="user-nickname">{{ user.nickname || '用戶' }}</span>
              </v-badge>
              <v-icon class="ml-1" small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list class="user-dropdown-list" :style="{ minWidth: buttonWidth + 'px' }">
            <v-list-item
              v-for="item in dropdownItems"
              :key="item.title"
              :style="{ minWidth: buttonWidth + 'px'}"
              :to="item.to"
              @click="item.action ? item.action() : null"
            >
              <v-list-item-title>
                <v-icon class="mr-1" small>{{ item.icon }}</v-icon>
                {{ item.title }}
              </v-list-item-title>
              <!-- ⭐️ 在通知項目旁也加上徽章，提升使用者體驗 -->
              <template v-if="item.to === '/notifications' && user.notificationCount > 0" #append>
                <v-badge color="red" :content="user.notificationCount" inline />
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const user = useUserStore()
  const createSnackbar = useSnackbar()

  watch(() => user.isLoggedIn, newVal => {
    console.log('isLoggedIn changed to:', newVal, 'Nickname:', user.nickname, 'Token:', user.token, 'Role:', user.role)
  })

  const navItems1 = [
    { title: '尋找換宿', to: '/FindHost' },
    { title: '旅遊分享', to: '/' },
    { title: '找旅伴', to: '/' },
    { title: '測驗去哪兒', to: '/' },
  ]

  const dropdownItems = computed(() => {
    return user.role === 'host'
      ? [
        { title: '工作', to: '/host/job', icon: 'mdi-briefcase' },
        { title: '通知', to: '/notifications', icon: 'mdi-bell' },
        { title: '尋找小幫手', to: '/backpackers', icon: 'mdi-file-document-multiple' },
        {
          title: '登出',
          to: '/',
          action: () => {
            user.logout()
            createSnackbar({
              text: '已成功登出！',
              snackbarProps: { color: 'green' },
            })
            router.push('/')
          },
          icon: 'mdi-logout',
        },
      ]
      : [
        { title: '喜愛工作', to: '/favorite-jobs', icon: 'mdi-heart' },
        { title: '喜愛文章', to: '/favorite-post', icon: 'mdi-file-document' },
        { title: '個人履歷', to: '/myresume', icon: 'mdi-account' },
        { title: '通知', to: '/notifications', icon: 'mdi-bell' },
        {
          title: '登出',
          to: '/',
          action: () => {
            user.logout()
            createSnackbar({
              text: '已成功登出！',
              snackbarProps: { color: 'green' },
            })
            router.push('/')
          },
          icon: 'mdi-logout',
        },
      ]
  })

  // 動態計算最大寬度
  const buttonWidth = computed(() => {
    const loginTextLength = '會員登入'.length
    const nicknameLength = (user.nickname || '用戶').length
    const maxDropdownLength = Math.max(...dropdownItems.value.map(item => item.title.length))

    // 取最大長度，並考慮 icon 和間距（每字符 10px + 40px 給 icon 和 padding）
    const maxTextLength = Math.max(loginTextLength, nicknameLength, maxDropdownLength)
    return maxTextLength * 10 + 40
  })
</script>

<style>
.v-toolbar-title {
  flex: none;
  max-width: 950px;
}

.brand-title {
  font-family: 'Noto Serif TC', serif;
  font-size: 1.5rem; /* 調整為適合 Noto Serif TC 的大小 */
  font-weight: 600; /* Serif 字體通常需要一些粗度來突顯 */
  letter-spacing: 0.1em; /* 增加字距，提升質感 */
}

.navitem1 {
  margin: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 80px;
  display: flex;
  align-items: center;
}

.navitem1 .v-btn {
  width: 6vw;
  height: 7vw !important;
  background: url('../assets/car_card.png') no-repeat center/contain;
  position: relative;
  bottom: -6px;
  margin-left: 30px;
  color: black;
}

.navitem1 .v-btn:hover {
  transform: translate(0, -10px);
  color: #ea914e;
}

.navitem1 .v-btn__content {
  position: relative;
  /* ⭐️ 您可以在這裡調整文字的垂直位置 */
  /* 數值越小 (例如 -15px)，文字越往下；數值越大 (例如 -25px)，文字越往上 */
  top: -23px;
  font-size: 1rem;
  font-weight: bold;
}

.navitem1 .v-btn--variant-text .v-btn__overlay {
  background: transparent !important;
}

.navitem2 .v-btn {
  width: 8vw;
  font-size: 1rem;
}

.custom-menu-btn {
  color: white !important;
  font-weight: bold !important;
}

/* ⭐️ 新增：專門用來調整導覽列上使用者暱稱的樣式 */
.user-nickname {
  font-size: 1.1rem; /* 您可以在這裡調整字體大小，例如 1.2rem 或 18px */
}

/* ⭐️ 調整下拉選單樣式 */
.user-dropdown-list .v-list-item-title {
  /* 建議：使用專業且易讀的深灰色，而非直接使用主色系 */
  color: #333;
  font-weight: 500;
}

.custom-container {
  max-width: 1300px;
}
</style>
