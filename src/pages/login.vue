<!-- src/pages/Login.vue -->
<template>
  <div>
    <!-- 引入首頁作為背景 -->
    <IndexPage />

    <!-- 登入視窗 -->
    <v-dialog v-model="loginDialog" max-width="800" persistent>
      <v-card class="pa-0">
        <v-row no-gutters>
          <v-col class="d-none d-md-block" md="6">
            <v-img
              class="rounded-l-lg"
              cover
              height="100%"
              :src="imageUrl"
              @error="imageUrl = '/fallback-image.png'"
            />
          </v-col>
          <v-col class="d-flex flex-column" cols="12" md="6">
            <div class="pa-md-8 pa-6 d-flex flex-column h-100">
              <v-card-title class="headline text-center pa-0 mb-6">會員登入</v-card-title>
              <v-card-text class="pa-0 flex-grow-1">
                <v-form v-model="loginFormValid" @submit.prevent="submitLogin">
                  <v-text-field
                    v-model="loginAccount"
                    label="帳號"
                    required
                    :rules="[v => !!v || '帳號是必填的']"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="loginPassword"
                    label="密碼"
                    required
                    :rules="[v => !!v || '密碼是必填的']"
                    type="password"
                    variant="outlined"
                  />
                  <v-btn
                    block
                    class="mt-2"
                    color="primary"
                    :disabled="!loginFormValid"
                    :loading="loginLoading"
                    type="submit"
                  >
                    登入
                  </v-btn>
                  <v-btn class="mt-2" color="primary" text @click="goToRegister">
                    還沒有建立帳號嗎？註冊
                  </v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-0 mt-4">
                <v-spacer />
                <v-btn color="secondary" @click="closeDialog">關閉</v-btn>
              </v-card-actions>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'
  import loginImage from '../assets/login-1.jpg'
  import IndexPage from './index.vue' // ⭐️ 引入首頁元件

  const loginDialog = ref(false)
  const loginFormValid = ref(false)
  const loginLoading = ref(false)

  const loginAccount = ref('')
  const loginPassword = ref('')
  const imageUrl = ref(loginImage)

  const route = useRoute()
  const router = useRouter()
  const user = useUserStore()
  const createSnackbar = useSnackbar()

  watch(
    () => route.path,
    newPath => {
      console.log('Route changed to:', newPath)
      loginDialog.value = newPath === '/login' ? true : false
    },
    { immediate: true },
  )

  const submitLogin = async () => {
    console.log('Submit clicked')
    loginLoading.value = true
    try {
      const response = await userService.login({
        account: loginAccount.value,
        password: loginPassword.value,
      })
      console.log('Raw response:', response) // 診斷完整回應
      const loginData = response.data.user || response.data // 適應嵌套結構
      if (!loginData.token) {
        throw new Error('Token is missing in response: ' + JSON.stringify(loginData))
      }
      user.login(loginData)
      console.log('Login success, Processed Data:', loginData, 'isLoggedIn:', user.isLoggedIn, 'Nickname:', user.nickname, 'Token:', user.token)
      createSnackbar({
        text: '登入成功！',
        snackbarProps: { color: 'green' },
      })
      router.push('/')
      closeDialog()
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message)
      createSnackbar({
        text: error.response?.data?.message || error.message || '登入失敗，請稍後再試！',
        snackbarProps: { color: 'red' },
      })
    } finally {
      loginLoading.value = false
    }
  }

  const goToRegister = () => {
    router.push('/register') // 直接導航到註冊頁，此元件將被銷毀
  }

  const closeDialog = () => {
    loginDialog.value = false
    router.push('/')
  }
</script>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.v-card-text {
  overflow-y: auto;
}
</style>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
