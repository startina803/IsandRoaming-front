<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center pa-12">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4">正在載入工作詳情...</p>
        </div>

        <!-- Error State -->
        <v-alert v-else-if="error" border="start" prominent type="error">
          <h3 class="mb-2">載入失敗</h3>
          {{ error }}
        </v-alert>

        <!-- Content -->
        <v-card v-else-if="job" class="mx-auto job-detail-card" rounded="lg">
          <!-- 1. 圖片輪播 (點擊可放大) -->
          <v-carousel
            v-if="job.photos && job.photos.length > 0"
            cycle
            height="300"
            hide-delimiter-background
            show-arrows="hover"
          >
            <v-carousel-item
              v-for="(photo, i) in job.photos"
              :key="i"
            >
              <!-- 將 v-img 獨立出來，並將點擊事件綁定在 v-img 上 -->
              <v-img
                class="fill-height clickable"
                cover
                :src="photo"
                @click="openImage(i)"
              >
                <v-tooltip activator="parent" location="center">點擊查看大圖</v-tooltip></v-img>
            </v-carousel-item>
          </v-carousel>
          <v-img
            v-else
            cover
            height="300px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          />

          <v-card-title class="text-h4 text-primary mt-4 mb-2 px-md-8 px-4">
            {{ job.title }}
          </v-card-title>

          <v-card-subtitle class="px-md-8 px-4">
            <v-icon class="mr-1" icon="mdi-map-marker" />
            {{ job.detailedLocation || job.location }}
          </v-card-subtitle>

          <v-divider class="my-6 mx-md-8 mx-4 orange-divider" />

          <v-list-item class="px-md-8 px-4">
            <v-list-item-title class="text-h6 font-weight-bold text-primary">換宿資訊</v-list-item-title>
          </v-list-item>
          <v-list class="py-0 px-md-8 px-4" density="compact">
            <v-list-item prepend-icon="mdi-calendar-clock" :subtitle="job.workPeriod || '未提供'" title="換宿期間" />
            <v-list-item prepend-icon="mdi-account-group" :subtitle="job.requiredPeopleCount || '未提供'" title="需求人數" />
            <v-list-item v-if="job.socialLink" prepend-icon="mdi-link-variant" title="相關連結">
              <template #subtitle>
                <a :href="job.socialLink" rel="noopener noreferrer" target="_blank">{{ job.socialLink }}</a>
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="my-6 mx-md-8 mx-4 orange-divider" />

          <v-card-text v-if="job.workContent" class="px-md-8 px-4">
            <div class="text-h6 font-weight-bold mb-2 text-primary">工作內容</div>
            <p class="text-body-1" style="white-space: pre-wrap;">{{ job.workContent }}</p>
          </v-card-text>

          <v-card-text v-if="job.helperBenefits" class="px-md-8 px-4">
            <div class="text-h6 font-weight-bold mb-2 text-primary">小幫手福利</div>
            <p class="text-body-1" style="white-space: pre-wrap;">{{ job.helperBenefits }}</p>
          </v-card-text>

          <v-card-text v-if="job.notes" class="px-md-8 px-4">
            <div class="text-h6 font-weight-bold mb-2 text-primary">注意事項</div>
            <p class="text-body-1" style="white-space: pre-wrap;">{{ job.notes }}</p>
          </v-card-text>

          <v-divider class="mt-6 mb-2 mx-md-8 mx-4 orange-divider" />

          <v-card-actions class="px-md-8 px-4 pt-4 pb-6">
            <!-- 1. 將返回按鈕移到左邊 -->
            <v-btn
              class="back-btn"
              icon="mdi-arrow-left"
              size="default"
              variant="text"
              @click="goBack"
            />
            <v-spacer />
            <!-- 2. 將應徵按鈕置中並加寬 -->
            <v-btn
              v-if="canApply"
              color="#ea914e"
              size="large"
              variant="flat"
              width="250"
              @click="openApplyDialog"
            >
              立即應徵
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>

    <!-- 2. 燈箱/彈窗 -->
    <v-dialog v-model="dialog" max-width="1200px" width="auto">
      <v-card rounded="lg">
        <v-btn
          class="dialog-close-btn"
          color="#ea914e"
          icon
          size="x-small"
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-carousel
          v-model="selectedImageIndex"
          height="80vh"
          hide-delimiters
          show-arrows="hover"
          style="width: 80vw; max-width: 1200px;"
        >
          <v-carousel-item
            v-for="(photo, i) in job.photos"
            :key="i"
          >
            <v-img contain height="100%" :src="photo" />
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>

    <!-- Application Dialog -->
    <v-dialog v-model="applyDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5 text-primary">應徵工作：{{ job?.title }}</span>
        </v-card-title>
        <v-card-text>
          <p class="mb-4">您即將向旅宿業者送出您的應徵申請。</p>
          <v-textarea
            v-model="applicationMessage"
            bg-color="orange-lighten-5"
            color="orange-darken-2"
            auto-grow
            counter
            label="想對旅宿業者說的話"
            placeholder="簡單介紹一下自己，並說明為什麼想應徵這份工作吧！"
            rows="5"
            :rules="[v => (v && v.trim().length > 0) || '訊息不能為空']"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="actionLoading" text @click="applyDialog = false">取消</v-btn>
          <v-btn
            color="orange-darken-2"
            :disabled="actionLoading || !applicationMessage.trim()"
            :loading="actionLoading"
            variant="flat"
            @click="submitApplication"
          >
            送出應徵
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import applicationService from '@/services/application.js'
  import jobService from '@/services/job.js'
  import userService from '@/services/user.js' // Import user service
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const router = useRouter()
  const user = useUserStore()
  const createSnackbar = useSnackbar()

  const job = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const dialog = ref(false)
  const selectedImageIndex = ref(0)

  const applyDialog = ref(false)
  const actionLoading = ref(false)
  const applicationMessage = ref('')
  const userResumeId = ref(null) // To store the user's resume ID

  const canApply = computed(() => {
    // Also check if the user has a resume
    return user.isLoggedIn && user.identity === '打工換宿者' && userResumeId.value
  })

  const openApplyDialog = () => {
    if (!job.value) return
    if (!userResumeId.value) {
      createSnackbar({ text: '您需要先建立一份履歷才能應徵', snackbarProps: { color: 'warning' } })
      // Optionally, redirect to resume creation page
      // router.push('/my-resume')
      return
    }
    applicationMessage.value = `您好，我是 ${user.nickname}，我對貴旅宿的「${job.value.title}」換宿工作很有興趣，希望能有機會加入！`
    applyDialog.value = true
  }

  const submitApplication = async () => {
    if (!applicationMessage.value || !applicationMessage.value.trim()) {
      createSnackbar({ text: '請輸入應徵訊息', snackbarProps: { color: 'warning' } })
      return
    }
    actionLoading.value = true
    try {
      const { data } = await applicationService.create({
        jobId: route.params.id,
        message: applicationMessage.value,
        resumeId: userResumeId.value, // Include resumeId in the payload
      })
      createSnackbar({ text: data.message || '應徵成功！', snackbarProps: { color: 'success' } })
      applyDialog.value = false
    } catch (error_) {
      createSnackbar({ text: error_.response?.data?.message || '應徵失敗', snackbarProps: { color: 'error' } })
    } finally {
      actionLoading.value = false
    }
  }

  const goBack = () => {
    router.go(-1)
  }

  const openImage = index => {
    selectedImageIndex.value = index
    dialog.value = true
  }

  onMounted(async () => {
    const jobId = route.params.id
    loading.value = true
    try {
      // Fetch job details
      const jobPromise = jobService.getPublicJobById(jobId)

      // Fetch user profile if logged in
      const profilePromise = user.isLoggedIn ? userService.profile() : Promise.resolve(null)

      const [jobResponse, profileResponse] = await Promise.all([jobPromise, profilePromise])

      job.value = jobResponse.data.result

      if (profileResponse && profileResponse.data.success) {
        const resumeIds = profileResponse.data.user.resumes // Now an array of IDs
        if (resumeIds && resumeIds.length > 0) {
          userResumeId.value = resumeIds[0] // Get the first ID
        }
      }
    } catch (error_) {
      console.error('Failed to fetch job details or user profile:', error_)
      error.value = '無法載入頁面，請稍後再試。'
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
.text-h4 {
  line-height: 1.2;
}

.clickable {
  cursor: pointer;
}

.dialog-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.job-detail-card {
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease-in-out;
  box-shadow: 10px 10px 0px  rgba(234, 145, 78, 0.5);
}

.v-textarea.v-textarea--outlined :deep(.v-field__outline) {
  /* Sets the default border color for the textarea */
  color: rgba(234, 145, 78, 0.4) !important;
}

.orange-divider {
  border-color: #ea914e !important;
  /* Vuetify dividers often have opacity, so we ensure it's fully visible */
  opacity: 1 !important;
}

.back-btn:hover {
  color: #ea914e;
}

.job-list-card { /* 假設這是您列表頁面中每個工作卡片的 class */
  border: 1px solid #eee; /* 輕微邊框 */
  transition: box-shadow 0.3s ease-in-out; /* 陰影過渡效果 */
  cursor: pointer; /* 提示可點擊 */
}

.job-list-card:hover {
  box-shadow: 0px 8px 24px -4px rgba(234, 145, 78, 0.3); /* 橘色陰影 */
}
</style>
