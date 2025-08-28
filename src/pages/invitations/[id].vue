<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-card v-if="loading" class="pa-5 text-center">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4">正在載入邀請內容...</p>
        </v-card>
        <v-alert v-else-if="error" prominent type="error">{{ error }}</v-alert>
        <transition v-else-if="invitation" appear name="card-open">
          <v-card class="invitation-card" rounded="lg">
            <v-card-title class="d-flex align-center pa-5">
              <v-btn
                class="mr-2"
                color="grey"
                icon
                size="small"
                variant="text"
                @click="goBack"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-h5 font-weight-bold text-primary">來自「{{ invitation.from.nickname }}」的換宿邀請</span>
            </v-card-title>
            <v-divider color="orange-darken-1" />

            <v-card-text class="pa-5">
              <p class="text-subtitle-1 mb-4">對方說：</p>
              <v-sheet class="pa-4 rounded-lg" color="grey-lighten-4">
                <p class="text-body-1" style="white-space: pre-wrap;">{{ invitation.message }}</p>
              </v-sheet>

              <v-divider class="my-6" color="orange-darken-1" />

              <h3 class="text-h6 font-weight-bold mb-4">邀請您應徵的工作</h3>
              <v-card v-if="invitation.job" variant="outlined">
                <v-card-title>{{ invitation.job.title }}</v-card-title>
                <v-card-subtitle>{{ invitation.job.location }}</v-card-subtitle>
                <v-card-text>
                  <p style="white-space: pre-wrap;">{{ invitation.job.workContent }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" :to="`/jobs/${invitation.job._id}`" variant="text">查看工作詳情</v-btn>
                </v-card-actions>
              </v-card>
              <v-alert v-else type="warning" variant="tonal">
                相關工作資訊不存在或已被刪除。
              </v-alert>
            </v-card-text>

            <v-divider color="orange-darken-1" />

            <div v-if="invitation.status === 'pending'">
              <v-card-text class="pa-5">
                <h3 class="text-h6 font-weight-bold mb-4">回覆此邀請</h3>
                <v-textarea
                  v-model="replyMessage"
                  auto-grow
                  label="您的回覆訊息 (選填)"
                  rows="3"
                  variant="outlined"
                />
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="grey" :loading="actionLoading" variant="text" @click="goBack">再考慮一下</v-btn>
                <v-btn color="error" :loading="actionLoading" variant="tonal" @click="handleAction('rejected')">拒絕</v-btn>
                <v-btn color="success" :loading="actionLoading" variant="flat" @click="handleAction('accepted')">接受</v-btn>
              </v-card-actions>
            </div>
            <div v-else class="pa-5 text-center">
              <v-chip :color="invitation.status === 'accepted' ? 'success' : 'error'" size="large">
                您已{{ invitation.status === 'accepted' ? '接受' : '拒絕' }}此邀請
              </v-chip>
              <v-btn class="mt-4" variant="text" @click="goBack">返回</v-btn>
            </div>
          </v-card>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import invitationService from '../../services/invitation.js'

  const route = useRoute()
  const router = useRouter()
  const createSnackbar = useSnackbar()

  const invitation = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const actionLoading = ref(false)
  const replyMessage = ref('')

  const fetchInvitation = async () => {
    try {
      const { data } = await invitationService.getById(route.params.id)
      if (data.success) {
        invitation.value = data.result
      } else {
        error.value = data.message
      }
    } catch (error_) {
      error.value = error_.response?.data?.message || '載入邀請失敗，請稍後再試。'
    } finally {
      loading.value = false
    }
  }

  const handleAction = async status => {
    actionLoading.value = true
    try {
      const { data } = await invitationService.updateStatus(route.params.id, status, replyMessage.value)
      if (data.success) {
        createSnackbar({ text: data.message, snackbarProps: { color: 'success' } })
        // 重新載入邀請資料以更新狀態
        await fetchInvitation()
      } else {
        createSnackbar({ text: data.message, snackbarProps: { color: 'error' } })
      }
    } catch (error_) {
      createSnackbar({ text: error_.response?.data?.message || '操作失敗', snackbarProps: { color: 'error' } })
    } finally {
      actionLoading.value = false
    }
  }

  const goBack = () => {
    router.back()
  }

  onMounted(fetchInvitation)
</script>

<style scoped>
.invitation-card {
  border: 1px solid #ea914e;
  box-shadow: 10px 10px 0px rgba(234, 145, 78, 0.5);
}

/* Card opening animation */
.card-open-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-open-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.card-open-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
