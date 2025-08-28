<!-- src/pages/Register.vue -->
<template>
  <v-container fluid>
    <v-row align="center" justify="center" style="min-height: 80vh;">
      <v-col cols="12">
        <v-dialog v-model="registerDialog" max-width="800">
          <v-card>
            <v-card-title class="headline" style="display: flex; justify-content: center">註冊</v-card-title>
            <v-card-text>
              <v-row>
                <!-- 左邊圖片 -->
                <v-col cols="6">
                  <v-img
                    aspect-ratio="1"
                    cover
                    :src="imageUrl"
                  />
                </v-col>

                <!-- 右邊註冊表單 -->
                <v-col cols="6">
                  <v-form v-model="registerFormValid" @submit.prevent="submitRegister">
                    <v-text-field
                      v-model="registerAccount"
                      label="帳號"
                      maxlength="20"
                      required
                      :rules="[v => !!v || '帳號是必填的', v => (v && v.length >= 4) || '至少4個字元']"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="registerEmail"
                      label="信箱"
                      required
                      :rules="[v => !!v || '信箱是必填的', v => /.+@.+\..+/.test(v) || '請輸入有效信箱']"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="registerPassword"
                      label="密碼"
                      maxlength="20"
                      required
                      :rules="[v => !!v || '密碼是必填的', v => (v && v.length >= 4) || '至少4個字元']"
                      type="password"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="registerConfirmPassword"
                      label="確認密碼"
                      required
                      :rules="[v => !!v || '確認密碼是必填的', v => v === registerPassword || '密碼不匹配']"
                      type="password"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model="registerNickname"
                      label="名字 / 旅宿名稱"
                      maxlength="20"
                      required
                      :rules="[v => !!v || '暱稱是必填的']"
                      variant="outlined"
                    />
                    <v-select
                      v-model="registerIdentity"
                      :items="identityOptions"
                      label="身分"
                      required
                      :rules="[v => !!v || '請選擇身分']"
                      variant="outlined"
                    />
                    <v-btn
                      block
                      class="mt-2"
                      color="primary"
                      :disabled="!registerFormValid"
                      :loading="registerLoading"
                      type="submit"
                    >
                      註冊
                    </v-btn>
                    <v-btn
                      class="mt-2"
                      color="primary"
                      text
                      @click="goToLogin"
                    >
                      返回登入
                    </v-btn>
                  </v-form>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" @click="closeDialog">關閉</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'

  const registerDialog = ref(false)
  const registerFormValid = ref(false)
  const registerLoading = ref(false)

  const registerAccount = ref('')
  const registerEmail = ref('')
  const registerPassword = ref('')
  const registerConfirmPassword = ref('')
  const registerNickname = ref('')
  const registerIdentity = ref('打工換宿者')
  const identityOptions = ['打工換宿者', '旅宿業者']
  const imageUrl = ref('https://via.placeholder.com/300x400') // 替換為您的圖片 URL

  const route = useRoute()
  const router = useRouter()
  const createSnackbar = useSnackbar()

  // 監聽路由變化，進入 /register 時打開對話框
  watch(
    () => route.path,
    newPath => {
      console.log('Route changed to:', newPath) // 診斷用
      registerDialog.value = newPath === '/register' ? true : false
    },
    { immediate: true }, // 立即執行一次
  )

  const submitRegister = async () => {
    registerLoading.value = true
    try {
      await userService.create({
        account: registerAccount.value,
        email: registerEmail.value,
        password: registerPassword.value,
        nickname: registerNickname.value,
        identity: registerIdentity.value,
      })
      createSnackbar({
        text: '註冊成功！返回登入頁面。',
        snackbarProps: { color: 'green' },
      })
      closeDialog()
      router.push('/login')
    } catch (error) {
      console.error('Register error:', error)
      createSnackbar({
        text: error.response?.data?.message || '註冊失敗，請稍後再試！',
        snackbarProps: { color: 'red' },
      })
    } finally {
      registerLoading.value = false
    }
  }

  const goToLogin = () => {
    closeDialog()
    router.push('/login')
  }

  const closeDialog = () => {
    registerDialog.value = false
    router.push('/') // 關閉後返回首頁
  }
</script>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
