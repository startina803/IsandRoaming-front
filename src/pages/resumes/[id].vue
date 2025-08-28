<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-btn
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="goBack"
        >
          返回上一頁
        </v-btn>

        <!-- Loading State -->
        <div v-if="loading" class="text-center pa-12">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4">正在載入履歷...</p>
        </div>

        <!-- Error State -->
        <v-alert v-else-if="error" border="start" prominent type="error">
          <h3 class="mb-2">載入失敗</h3>
          {{ error }}
        </v-alert>

        <!-- Content -->
        <v-card v-else-if="resume" class="resume-card" rounded="lg">
          <v-row no-gutters>
            <!-- Left Column: Photo and Basic Info -->
            <v-col class="pa-md-8 pa-5 left-column" cols="12" md="4">
              <v-carousel
                v-if="resume.photos && resume.photos.length > 0"
                cycle
                height="300"
                hide-delimiter-background
                show-arrows="hover"
                style="border-radius: 8px;"
              >
                <v-carousel-item v-for="(photo, i) in resume.photos" :key="i">
                  <v-img class="fill-height clickable" cover :src="photo" @click="openImage(i)">
                    <v-tooltip activator="parent" location="center">點擊查看大圖</v-tooltip>
                  </v-img>
                </v-carousel-item>
              </v-carousel>

              <div class="text-center mt-6">
                <h2 class="text-h4 font-weight-bold text-primary mb-2">{{ resume.basicInfo.name }}</h2>
                <p class="text-h6 text-grey-darken-1">{{ resume.basicInfo.age }} 歲</p>
                <div v-if="resume.socialLink" class="mb-6">
                  <a class="social-link" :href="resume.socialLink" rel="noopener noreferrer" target="_blank">
                    <v-icon small>mdi-link-variant</v-icon>
                    社群連結
                  </a>
                </div>
                <v-btn
                  block
                  class="mb-4"
                  :color="hasBeenInvited ? 'success' : 'primary'"
                  :disabled="hasBeenInvited"
                  size="large"
                  variant="flat"
                  @click="openInviteDialog"
                >
                  <v-icon start>
                    {{ hasBeenInvited ? 'mdi-check-circle-outline' : 'mdi-email-send-outline' }}
                  </v-icon>
                  {{ hasBeenInvited ? '已邀請' : '邀請換宿' }}
                </v-btn>
              </div>

              <v-divider class="my-8" />

              <h3 class="text-h6 font-weight-bold text-primary mb-4">換宿偏好</h3>
              <div class="resume-section">
                <h4 class="section-title">期望換宿地點</h4>
                <v-chip-group>
                  <v-chip v-for="loc in resume.preferences.location" :key="loc" color="info" variant="tonal">{{ loc }}</v-chip>
                </v-chip-group>
              </div>
              <div class="resume-section">
                <h4 class="section-title">期望換宿類型</h4>
                <v-chip-group>
                  <v-chip v-for="type in resume.hostelType" :key="type" color="success" variant="tonal">{{ type }}</v-chip>
                </v-chip-group>
              </div>
              <div class="resume-section">
                <h4 class="section-title">期望待遇</h4>
                <v-chip-group>
                  <v-chip v-for="benefit in resume.expectedBenefits" :key="benefit" color="warning" variant="tonal">{{ benefit }}</v-chip>
                </v-chip-group>
              </div>
              <div v-if="resume.preferences && resume.preferences.time" class="resume-section">
                <h4 class="section-title">期望時間</h4>
                <p class="text-body-1">{{ resume.preferences.time }}</p>
              </div>
            </v-col>

            <!-- Right Column: Detailed Information -->
            <v-col class="pa-md-8 pa-5" cols="12" md="8">
              <h3 class="text-h5 font-weight-bold text-primary mb-6">關於我</h3>
              <div class="resume-section">
                <h4 class="section-title">學歷</h4>
                <p class="text-body-1">{{ resume.education }}</p>
              </div>
              <div class="resume-section">
                <h4 class="section-title">工作經驗</h4>
                <p class="text-body-1" style="white-space: pre-wrap;">{{ resume.experience }}</p>
              </div>
              <div class="resume-section">
                <h4 class="section-title">換宿動機</h4>
                <p class="text-body-1">{{ resume.motivation }}</p>
              </div>

              <v-divider class="my-8" />

              <h3 class="text-h5 font-weight-bold text-primary mb-6">我的技能與興趣</h3>
              <div class="resume-section">
                <h4 class="section-title">語言能力</h4>
                <v-chip-group>
                  <v-chip v-for="lang in resume.languages" :key="lang" color="primary" variant="tonal">{{ lang }}</v-chip>
                </v-chip-group>
              </div>
              <div class="resume-section">
                <h4 class="section-title">興趣</h4>
                <v-chip-group>
                  <v-chip v-for="interest in resume.interests" :key="interest" color="secondary" variant="tonal">{{ interest }}</v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Invitation Dialog -->
    <v-dialog v-model="inviteDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">發送換宿邀請</span>
        </v-card-title>
        <v-card-text>
          <p v-if="resume" class="mb-4">您即將邀請 <strong class="text-primary">{{ resume.basicInfo.name }}</strong></p>
          <div v-if="inviteLoading && !hostJobId" class="text-center">
            <v-progress-circular color="primary" indeterminate />
            <p class="mt-2">正在準備邀請...</p>
          </div>
          <v-textarea
            v-else
            v-model="invitationMessage"
            auto-grow
            counter
            label="邀請訊息"
            rows="5"
            :rules="[v => (v && v.trim().length > 0) || '訊息不能為空']"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="inviteLoading" text @click="inviteDialog = false">取消</v-btn>
          <v-btn
            color="primary"
            :disabled="inviteLoading || !invitationMessage.trim()"
            :loading="inviteLoading"
            variant="flat"
            @click="sendInvitation"
          >
            送出邀請
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Lightbox Dialog -->
    <v-dialog v-model="dialog" max-width="1200px" width="auto">
      <v-card rounded="lg">
        <v-btn
          class="dialog-close-btn"
          color="white"
          icon
          size="x-small"
          variant="text"
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-carousel
          v-if="resume && resume.photos"
          v-model="selectedImageIndex"
          height="80vh"
          hide-delimiters
          show-arrows="hover"
          style="width: 80vw; max-width: 1200px;"
        >
          <v-carousel-item v-for="(photo, i) in resume.photos" :key="i">
            <v-img contain height="100%" :src="photo" />
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import invitationService from '@/services/invitation'
  import jobService from '@/services/job'
  import resumeService from '@/services/resume'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const router = useRouter()
  const user = useUserStore()
  const createSnackbar = useSnackbar()

  const resume = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Invitation Dialog State
  const inviteDialog = ref(false)
  const inviteLoading = ref(false)
  const hostJobId = ref(null)
  const invitationMessage = ref('')

  const hasBeenInvited = ref(false)

  // Image Lightbox State
  const dialog = ref(false)
  const selectedImageIndex = ref(0)

  const openImage = index => {
    selectedImageIndex.value = index
    dialog.value = true
  }
  const openInviteDialog = async () => {
    if (!user.isLoggedIn) {
      router.push('/login')
      return
    }
    inviteDialog.value = true
    inviteLoading.value = true
    try {
      const { data } = await jobService.getMyJobs()
      const openJobs = data.result.filter(job => job.status === 'open')
      if (openJobs.length === 0) {
        createSnackbar({ text: '您沒有已刊登且開放中的工作，無法發送邀請。', snackbarProps: { color: 'error' } })
        inviteDialog.value = false
        return
      }
      // As per request, assume one job. Use the first open job found.
      hostJobId.value = openJobs[0]._id
      // Use the logged-in host's name from the user store, as job data may not contain populated host info.
      invitationMessage.value = `您好，我們是「${user.nickname}」，誠摯邀請您來我們的旅宿打工換宿！`
    } catch (error_) {
      console.error('Failed to load host jobs:', error_)
      const errorMessage = error_.response?.data?.message || '載入您的工作時發生錯誤，請稍後再試。'
      createSnackbar({ text: errorMessage, snackbarProps: { color: 'error' } })
      inviteDialog.value = false
    } finally {
      inviteLoading.value = false
    }
  }

  const sendInvitation = async () => {
    if (!invitationMessage.value || !invitationMessage.value.trim()) {
      createSnackbar({ text: '請輸入邀請訊息', snackbarProps: { color: 'warning' } })
      return
    }
    inviteLoading.value = true
    try {
      await invitationService.create({
        targetId: route.params.id, // The backpacker's user ID
        jobId: hostJobId.value,
        message: invitationMessage.value,
      })
      createSnackbar({ text: '邀請已送出！', snackbarProps: { color: 'success' } })
      inviteDialog.value = false
      hasBeenInvited.value = true
    } catch (error_) {
      const errorMessage = error_.response?.data?.message || '傳送邀請失敗'
      // Handle the specific case where the user has already been invited
      if (errorMessage.includes('已邀請')) {
        // This is not a real error, but a status confirmation.
        createSnackbar({ text: errorMessage, snackbarProps: { color: 'info' } })
        inviteDialog.value = false
        hasBeenInvited.value = true // Correct the state to "Invited"
      } else {
        createSnackbar({ text: errorMessage, snackbarProps: { color: 'error' } })
      }
    } finally {
      inviteLoading.value = false
    }
  }

  const goBack = () => {
    router.back()
  }

  onMounted(async () => {
    loading.value = true
    try {
      const userId = route.params.id
      // ⭐️ 修正：頁面是透過使用者 ID 進入的，所以應該呼叫 getPublicResumeByUserId
      // 而不是 getPublicResumeById，後者需要的是履歷本身的 ID。
      const { data } = await resumeService.getPublicResumeByUserId(userId)
      if (data.result) {
        resume.value = data.result
      } else {
        error.value = '找不到該使用者的履歷，或履歷未公開。'
      }
    } catch (error_) {
      console.error('Failed to fetch resume:', error_)
      error.value = error_.response?.data?.message || '載入履歷時發生錯誤，請稍後再試。'
    } finally {
      loading.value = false
    }

    // If the viewer is logged in, check if they have already invited this backpacker
    if (user.isLoggedIn) {
      try {
        const backpackerId = route.params.id
        const { data } = await invitationService.checkStatusToUser(backpackerId)
        if (data.hasBeenInvited) {
          hasBeenInvited.value = true
        }
      } catch (err) {
        console.error('Failed to check invitation status', err)
        // Don't show an error, just proceed without the "invited" state
      }
    }
  })
</script>

<style scoped>
.resume-card {
  border: 1px solid #ea914e;
  box-shadow: 10px 10px 0px rgba(234, 145, 78, 0.5);
  overflow: hidden;
}

.left-column {
  border-right: 1px solid #eee;
}

@media (max-width: 959px) {
  .left-column {
    border-right: none;
    border-bottom: 1px solid #eee;
  }
}

.clickable {
  cursor: pointer;
}

.social-link {
  color: #3B7D96; /* Primary color */
  text-decoration: none;
  transition: opacity 0.2s;
}

.social-link:hover {
  opacity: 0.7;
}
.resume-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 0.75rem;
  border-left: 4px solid #ea914e;
  padding-left: 0.75rem;
}

.dialog-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
