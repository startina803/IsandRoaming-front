<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-card v-if="loading" class="pa-5 text-center">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4">正在載入應徵內容...</p>
        </v-card>
        <v-alert v-else-if="error" prominent type="error">{{ error }}</v-alert>
        <transition v-else-if="application" appear name="card-open">
          <v-card class="application-card" rounded="lg">
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
              <span class="text-h5 font-weight-bold text-primary">來自「{{ application.applicant.nickname }}」的應徵</span>
            </v-card-title>
            <v-divider color="orange-darken-1" />

            <v-card-text class="pa-5">
              <p class="text-subtitle-1 mb-4">對方說：</p>
              <v-sheet class="pa-4 rounded-lg" color="grey-lighten-4">
                <p class="text-body-1" style="white-space: pre-wrap;">{{ application.message }}</p>
              </v-sheet>

              <v-divider class="my-6" color="orange-darken-1" />

              <h3 class="text-h6 font-weight-bold mb-4">應徵者履歷</h3>
              <v-card v-if="application.resume" :to="`/resumes/${application.resume._id}`" variant="outlined">
                <v-card-title>查看 {{ application.applicant.nickname }} 的履歷</v-card-title>
                <v-card-subtitle>點此查看完整履歷</v-card-subtitle>
              </v-card>
              <v-alert v-else type="warning" variant="tonal">
                應徵者尚未建立履歷。
              </v-alert>

              <v-divider class="my-6" color="orange-darken-1" />

              <h3 class="text-h6 font-weight-bold mb-4">應徵的工作</h3>
              <v-card v-if="application.job" variant="outlined">
                <v-card-title>{{ application.job.title }}</v-card-title>
                <v-card-subtitle>{{ application.job.location }}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" :to="`/jobs/${application.job._id}`" variant="text">查看工作詳情</v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>

            <v-divider color="orange-darken-1" />

            <div v-if="application.status === 'pending'">
              <v-card-text class="pa-5">
                <h3 class="text-h6 font-weight-bold mb-4">回覆此應徵</h3>
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
                <v-btn color="grey" :loading="actionLoading" variant="text" @click="goBack">再考慮</v-btn>
                <v-btn color="error" :loading="actionLoading" variant="tonal" @click="handleAction('rejected')">拒絕</v-btn>
                <v-btn color="success" :loading="actionLoading" variant="flat" @click="handleAction('accepted')">接受</v-btn>
              </v-card-actions>
            </div>
            <div v-else class="pa-5 text-center">
              <v-chip :color="application.status === 'accepted' ? 'success' : 'error'" size="large">
                您已{{ application.status === 'accepted' ? '接受' : '拒絕' }}此應徵
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
  import applicationService from '@/services/application'

  const route = useRoute()
  const router = useRouter()
  const createSnackbar = useSnackbar()

  const application = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const actionLoading = ref(false)
  const replyMessage = ref('')

  const fetchApplication = async () => {
    try {
      const { data } = await applicationService.getById(route.params.id)
      if (data.success) {
        application.value = data.result
      } else {
        error.value = data.message
      }
    } catch (error_) {
      error.value = error_.response?.data?.message || '載入應徵失敗，請稍後再試。'
    } finally {
      loading.value = false
    }
  }

  const handleAction = async status => {
    actionLoading.value = true
    try {
      const { data } = await applicationService.updateStatus(route.params.id, status, replyMessage.value)
      if (data.success) {
        createSnackbar({ text: data.message, snackbarProps: { color: 'success' } })
        await fetchApplication()
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

  onMounted(fetchApplication)
</script>

<style scoped>
.application-card {
  border: 1px solid #ea914e;
  box-shadow: 10px 10px 0px rgba(234, 145, 78, 0.5);
}

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
