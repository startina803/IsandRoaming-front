<!-- src/pages/MyResume.vue -->
<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card style="border:1px solid #3B7D96 !important;box-shadow: 10px 10px 0px rgba(60,125,150,0.5);padding:1.5rem;">
          <v-card-title class="d-flex align-center justify-space-between w-100">
            <span class="headline text-primary">{{ pageTitle }}</span>
            <v-btn
              v-if="hasResume && !isEditing"
              color="primary"
              icon
              size="small"
              @click="isEditing = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form v-if="!initialLoading" v-model="formValid" @submit.prevent="saveResume">
              <v-row v-if="mainPhotoUrl" class="mb-4" justify="center">
                <v-col cols="12" md="3">
                  <v-img
                    aspect-ratio="1"
                    class="rounded-lg elevation-4"
                    cover
                    :src="mainPhotoUrl"
                  />
                </v-col>
              </v-row>

              <v-row v-if="localPhotoPreviews.length > 0" class="mb-2" justify="center">
                <v-col
                  v-for="(url, index) in localPhotoPreviews"
                  :key="index"
                  class="d-flex justify-center"
                  cols="auto"
                >
                  <v-img
                    aspect-ratio="1"
                    class="rounded-lg"
                    :class="{ 'photo-thumbnail': true, 'active': url === mainPhotoUrl }"
                    :src="url"
                    @click="mainPhotoUrl = url"
                  />
                </v-col>
              </v-row>

              <v-file-input
                v-if="isEditing"
                v-model="photoFiles"
                label="上傳個人照片 (一次多選上傳，最多五張)"
                multiple
                :rules="photoRules"
                variant="outlined"
                @change="handlePhotoChange"
              />

              <div v-if="resume.basicInfo">
                <v-text-field
                  v-model="resume.basicInfo.name"
                  label="姓名"
                  :readonly="!isEditing"
                  required
                  :rules="[v => !!v || '姓名是必填的']"
                  variant="outlined"
                />
                <v-text-field
                  v-model.number="resume.basicInfo.age"
                  label="年齡"
                  :readonly="!isEditing"
                  required
                  :rules="[v => !!v && v >= 18 || '年齡必須大於或等於 18']"
                  type="number"
                  variant="outlined"
                />
              </div>

              <v-text-field
                v-model="resume.education"
                label="學歷"
                :readonly="!isEditing"
                required
                :rules="[v => !!v || '學歷是必填的']"
                variant="outlined"
              />

              <v-select
                v-model="resume.licenses"
                :chip-props="{ size: isEditing ? 'large' : 'small' }"
                chips
                :closable-chips="isEditing"
                :items="['無', '機車', '汽車']"
                label="駕照 (可多選)"
                multiple
                :readonly="!isEditing"
                required
                :rules="[v => !!v && v.length > 0 || '請選擇至少一個駕照選項']"
                variant="outlined"
              />

              <v-select
                v-model="resume.languages"
                :chip-props="{ size: isEditing ? 'large' : 'small' }"
                chips
                :closable-chips="isEditing"
                :items="['中文', '英文', '台語', '日文', '其他']"
                label="語言"
                multiple
                :readonly="!isEditing"
                required
                :rules="[v => !!v && v.length > 0 || '至少選擇一種語言']"
                variant="outlined"
              />

              <v-textarea
                v-model="resume.experience"
                label="工作經驗"
                :readonly="!isEditing"
                required
                :rules="[v => !!v || '工作經驗是必填的']"
                variant="outlined"
              />

              <div v-if="resume.preferences">
                <v-select
                  v-model="resume.preferences.location"
                  :chip-props="{ size: isEditing ? 'large' : 'small' }"
                  chips
                  :closable-chips="isEditing"
                  item-title="title"
                  item-value="value"
                  :items="locationItems"
                  label="希望地點 (可多選)"
                  multiple
                  :readonly="!isEditing"
                  required
                  :rules="[v => !!v && v.length > 0 || '至少選擇一個希望地點']"
                  variant="outlined"
                />
                <v-text-field
                  v-model="resume.preferences.time"
                  label="希望時間"
                  :readonly="!isEditing"
                  required
                  :rules="[v => !!v || '希望時間是必填的']"
                  variant="outlined"
                />
              </div>

              <v-select
                v-model="resume.hostelType"
                :chip-props="{ size: isEditing ? 'large' : 'small' }"
                chips
                :closable-chips="isEditing"
                :items="['旅宿', '餐飲', '潛水/衝浪']"
                label="換宿類型"
                multiple
                :readonly="!isEditing"
                required
                :rules="[v => !!v && v.length > 0 || '至少選擇一種換宿類型']"
                variant="outlined"
              />
              <v-select
                v-model="resume.expectedBenefits"
                :chip-props="{ size: isEditing ? 'large' : 'small' }"
                chips
                :closable-chips="isEditing"
                :items="['機車', '住宿', '伙食', '零用金', '交通票券']"
                label="期望待遇"
                multiple
                :readonly="!isEditing"
                required
                :rules="[v => !!v && v.length > 0 || '至少選擇一種期望待遇']"
                variant="outlined"
              />

              <v-text-field
                v-model="interestsString"
                label="興趣 (請用逗點分隔)"
                :readonly="!isEditing"
                variant="outlined"
              />

              <v-text-field
                v-model="personalityString"
                label="個性 (請用逗點分隔)"
                :readonly="!isEditing"
                variant="outlined"
              />

              <v-textarea
                v-model="resume.motivation"
                label="換宿動機"
                :readonly="!isEditing"
                required
                :rules="[v => !!v || '換宿動機是必填的']"
                variant="outlined"
              />

              <v-text-field
                v-model="resume.socialLink"
                label="社群網址"
                placeholder="例如: https://instagram.com/"
                :readonly="!isEditing"
                :rules="[v => !v || isValidUrl(v) || '請輸入有效的網址']"
                variant="outlined"
              />

              <v-switch
                v-model="resume.isPublic"
                class="mt-2"
                color="primary"
                :disabled="!isEditing"
                label="是否公開履歷"
              />

              <v-row class="mt-4">
                <v-col cols="6" offset="3">
                  <div v-if="isEditing" class="d-flex justify-center">
                    <v-btn
                      block
                      class="ma-2"
                      color="primary"
                      :disabled="!formValid || loading || !hasChanges"
                      :loading="loading"
                      type="submit"
                    >
                      保存履歷
                    </v-btn>
                    <v-btn
                      block
                      class="ma-2"
                      color="secondary"
                      :disabled="loading"
                      @click="cancelEditing"
                    >
                      取消編輯
                    </v-btn>
                  </div>
                  <v-btn
                    v-else
                    block
                    class="ma-2"
                    color="secondary"
                    @click="isEditing = true"
                  >
                    修改履歷
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <div v-else class="d-flex justify-center align-center" style="height: 300px;">
              <v-progress-circular color="primary" indeterminate />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import resumeService from '@/services/resume'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const user = useUserStore()
  const createSnackbar = useSnackbar()

  const formValid = ref(false)
  const loading = ref(false)
  const initialLoading = ref(true)
  const hasResume = ref(false)
  const isEditing = ref(false)

  const resume = ref({
    _id: '',
    photos: [],
    basicInfo: { name: '', age: 0 },
    education: '',
    licenses: [],
    languages: [],
    experience: '',
    preferences: { location: [], time: '' },
    hostelType: [],
    expectedBenefits: [],
    interests: [],
    personality: [],
    motivation: '',
    socialLink: '',
    isPublic: false,
  })

  const originalResume = ref(null)
  const photoFiles = ref([])
  const localPhotoPreviews = ref([])
  const mainPhotoUrl = ref(null)

  const pageTitle = computed(() => {
    return hasResume.value ? '我的履歷' : '發布履歷'
  })

  const interestsString = computed({
    get: () => resume.value.interests.join(', '),
    set: val => {
      resume.value.interests = val.split(',').map(item => item.trim()).filter(item => item !== '')
    },
  })

  const personalityString = computed({
    get: () => resume.value.personality.join(', '),
    set: val => {
      resume.value.personality = val.split(',').map(item => item.trim()).filter(item => item !== '')
    },
  })

  const locationItems = [
    '不限', '台北', '新北', '桃園', '台中', '台南', '高雄', '新竹', '苗栗',
    '彰化', '南投', '雲林', '嘉義', '屏東', '宜蘭', '花蓮', '台東',
    '澎湖', '金門', '連江', '基隆', '新竹', '嘉義', '綠島', '小琉球',
    '蘭嶼', '馬祖',
  ].map(location => ({ title: location, value: location }))

  const isValidUrl = url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handlePhotoChange = files => {
    for (const url of localPhotoPreviews.value) {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    }
    const existingPhotos = resume.value.photos?.filter(url => !url.startsWith('blob:')) || []
    const newPreviews = Array.isArray(files) ? files : (files ? [files] : [])
    localPhotoPreviews.value = [
      ...existingPhotos,
      ...newPreviews.map(file => URL.createObjectURL(file)),
    ]
    mainPhotoUrl.value = localPhotoPreviews.value.length > 0 ? localPhotoPreviews.value[0] : null
  }

  const photoRules = computed(() => {
    const rules = []
    const totalPhotos = (resume.value.photos?.length || 0) + (photoFiles.value?.length || 0)

    if (!hasResume.value) {
      rules.push(v => (v && v.length > 0) || '請上傳個人照片')
    }
    rules.push(v => totalPhotos <= 5 || '上傳照片總數不能超過 5 張')

    return rules
  })

  const hasChanges = computed(() => {
    console.log('Checking hasChanges:', { photoFiles: photoFiles.value.length, resumePhotos: resume.value.photos, originalPhotos: originalResume.value?.photos })
    if (photoFiles.value.length > 0) return true // 新照片視為變更
    if (!originalResume.value) return true

    const current = { ...toRaw(resume.value) }
    const original = { ...toRaw(originalResume.value) }
    // 只比較持久化照片，忽略 blob URL
    current.photos = current.photos?.filter(url => !url.startsWith('blob:')) || []
    original.photos = original.photos?.filter(url => !url.startsWith('blob:')) || []

    return JSON.stringify(current) !== JSON.stringify(original)
  })

  const cancelEditing = () => {
    Object.assign(resume.value, structuredClone(toRaw(originalResume.value)))
    photoFiles.value = []
    localPhotoPreviews.value = resume.value.photos || []
    mainPhotoUrl.value = localPhotoPreviews.value.length > 0 ? localPhotoPreviews.value[0] : null
    isEditing.value = false
    createSnackbar({ text: '已取消修改', snackbarProps: { color: 'info' } })
  }

  onMounted(async () => {
    if (!user.isLoggedIn) {
      router.push('/login')
      return
    }
    try {
      const { data } = await resumeService.getMyResume()
      if (data.result && typeof data.result === 'object') {
        Object.assign(resume.value, data.result)
        originalResume.value = structuredClone(toRaw(data.result))
        hasResume.value = true
        isEditing.value = false
        localPhotoPreviews.value = resume.value.photos || []
        mainPhotoUrl.value = localPhotoPreviews.value.length > 0 ? localPhotoPreviews.value[0] : null
      } else {
        hasResume.value = false
        isEditing.value = true
      }
    } catch (error) {
      console.error('Get resume error:', error)
      if (error.response && error.response.status === 404) {
        hasResume.value = false
        isEditing.value = true
      } else {
        createSnackbar({ text: error.response?.data?.message || '載入履歷失敗', snackbarProps: { color: 'red' } })
      }
    } finally {
      initialLoading.value = false
    }
  })

  watch(isEditing, newValue => {
    if (newValue && originalResume.value) {
      Object.assign(resume.value, structuredClone(toRaw(originalResume.value)))
      photoFiles.value = []
      localPhotoPreviews.value = resume.value.photos || []
      mainPhotoUrl.value = localPhotoPreviews.value.length > 0 ? localPhotoPreviews.value[0] : null
    }
  }, { immediate: true })

  const saveResume = async () => {
    loading.value = true
    console.log('Saving resume:', { formValid: formValid.value, hasChanges: hasChanges.value, resume: toRaw(resume.value), photoFiles: photoFiles.value })
    try {
      if (!formValid.value) {
        createSnackbar({ text: '請檢查所有必填欄位', snackbarProps: { color: 'red' } })
        return
      }

      if (!hasChanges.value) {
        createSnackbar({ text: '資料沒有變動', snackbarProps: { color: 'info' } })
        isEditing.value = false
        return
      }

      const fd = new FormData()
      fd.append('basicInfo', JSON.stringify(resume.value.basicInfo))
      fd.append('education', resume.value.education)
      fd.append('licenses', JSON.stringify(resume.value.licenses))
      fd.append('languages', JSON.stringify(resume.value.languages))
      fd.append('experience', resume.value.experience)
      fd.append('preferences', JSON.stringify(resume.value.preferences))
      fd.append('hostelType', JSON.stringify(resume.value.hostelType))
      fd.append('expectedBenefits', JSON.stringify(resume.value.expectedBenefits))
      fd.append('interests', JSON.stringify(resume.value.interests))
      fd.append('personality', JSON.stringify(resume.value.personality))
      fd.append('motivation', resume.value.motivation)
      fd.append('socialLink', resume.value.socialLink)
      fd.append('isPublic', resume.value.isPublic)

      const existingPhotos = resume.value.photos?.filter(url => !url.startsWith('blob:')) || []
      if (hasResume.value && existingPhotos.length > 0) {
        fd.append('photosToKeep', JSON.stringify(existingPhotos))
      }
      if (photoFiles.value.length > 0) {
        for (const file of photoFiles.value) {
          fd.append('images', file)
        }
      }

      const { data } = await (hasResume.value
        ? resumeService.updateResume(resume.value._id, fd)
        : resumeService.createResume(fd))
      console.log('Save response:', data)
      createSnackbar({ text: '保存成功', snackbarProps: { color: 'green' } })

      Object.assign(resume.value, data.result)
      originalResume.value = structuredClone(toRaw(resume.value))
      isEditing.value = false
      photoFiles.value = []
      localPhotoPreviews.value = data.result.photos || []
      mainPhotoUrl.value = localPhotoPreviews.value.length > 0 ? localPhotoPreviews.value[0] : null
    } catch (error) {
      console.error('Save resume error:', error)
      createSnackbar({ text: error.response?.data?.message || '保存失敗', snackbarProps: { color: 'red' } })
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: bold;
}
.v-chip.v-chip--size-large {
  height: 38px;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 0.95rem;
}
.photo-thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.photo-thumbnail.active {
  border-color: #1976D2;
}
</style>
