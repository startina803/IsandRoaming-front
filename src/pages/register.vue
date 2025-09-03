<!-- src/pages/Register.vue -->
<template>
  <div>
    <!-- 引入首頁作為背景 -->
    <IndexPage />

    <!-- 註冊視窗 -->
    <v-dialog v-model="registerDialog" max-width="850" persistent>
      <!-- ⭐️ 修改：移除 v-card 的 padding，讓圖片可以貼齊邊緣 -->
      <v-card class="pa-0">
        <!-- ⭐️ 修改：使用 v-row 和 v-col 重新排版，讓圖片和表單等高 -->
        <v-row no-gutters>
          <!-- 左邊圖片 -->
          <!-- ⭐️ 新增：在 md 以上的螢幕尺寸才顯示圖片 -->
          <v-col class="d-none d-md-block" md="6">
            <v-img
              class="rounded-l-lg"
              cover
              height="100%"
              :src="imageUrl"
            />
          </v-col>

          <!-- 右邊註冊表單 -->
          <v-col class="d-flex flex-column" cols="12" md="6">
            <div class="pa-md-8 pa-6 d-flex flex-column h-100">
              <v-card-title class="headline text-center pa-0 mb-6">註冊</v-card-title>
              <v-card-text class="pa-0 flex-grow-1">
                <v-form v-model="registerFormValid" @submit.prevent="submitRegister">
                  <v-text-field
                    v-model="form.account"
                    label="帳號"
                    maxlength="20"
                    required
                    :rules="[v => !!v || '帳號是必填的', v => (v && v.length >= 4) || '至少4個字元']"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="form.email"
                    label="信箱"
                    required
                    :rules="[v => !!v || '信箱是必填的', v => /.+@.+\..+/.test(v) || '請輸入有效信箱']"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="form.password"
                    label="密碼"
                    maxlength="20"
                    required
                    :rules="[v => !!v || '密碼是必填的', v => (v && v.length >= 4) || '至少4個字元']"
                    type="password"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="form.confirmPassword"
                    label="確認密碼"
                    required
                    :rules="[v => !!v || '確認密碼是必填的', v => v === form.password || '密碼不匹配']"
                    type="password"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="form.nickname"
                    label="名字 / 旅宿名稱"
                    maxlength="20"
                    required
                    :rules="[v => !!v || '暱稱是必填的']"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.identity"
                    item-title="title"
                    item-value="value"
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
  import { reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  // ⭐️ 修正：將圖片名稱改為 register-1.jpg，與登入頁的命名慣例 (login-1.jpg) 保持一致。
  // 請務必確認在 src/assets/ 資料夾中，圖片的檔名確實是 register-1.jpg
  import registerImage from '@/assets/register-1.jpg'
  import userService from '@/services/user'
  import IndexPage from './index.vue'

  const registerDialog = ref(false)
  const registerFormValid = ref(false)
  const registerLoading = ref(false)
  // ⭐️ 重構：使用 reactive 將表單資料整合在一起，讓程式碼更簡潔
  const form = reactive({
    account: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    identity: 'seeker', // ⭐️ 修正：預設值改為 'seeker'，以匹配後端 role enum
  })
  const identityOptions = [
    { title: '背包客', value: 'seeker' }, // ⭐️ 修正：value 改為 'seeker'
    { title: '旅宿主人', value: 'host' }, // ⭐️ 修正：value 改為 'host'
  ]
  const imageUrl = ref(registerImage) // ⭐️ 使用引入的圖片

  const route = useRoute()
  const router = useRouter()
  const createSnackbar = useSnackbar()

  // 監聽路由變化，進入 /register 時打開對話框
  watch(
    () => route.path,
    newPath => {
      registerDialog.value = newPath === '/register'
    },
    { immediate: true }, // 立即執行一次
  )

  const submitRegister = async () => {
    if (!registerFormValid.value) return
    registerLoading.value = true
    try {
      // ⭐️ 修正：根據選擇的身分，動態建立後端需要的資料格式 (payload)
      //    同時，將 nickname 欄位傳遞給後端
      const payload = {
        account: form.account,
        email: form.email,
        password: form.password,
        nickname: form.nickname, // ⭐️ 新增：將 nickname 加入 payload
        role: form.identity, // ⭐️ 修正：現在 identity 的值是 'seeker' 或 'host'
      }

      await userService.create(payload)

      createSnackbar({
        text: '註冊成功！將為您導向登入頁面。',
        snackbarProps: { color: 'green' },
      })
      goToLogin()
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
    // 直接導航，此頁面元件將被銷毀，對話框會自動關閉
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
.v-card-text {
  /* ⭐️ 新增：當表單過長時，允許內部滾動 */
  overflow-y: auto;
}
</style>
