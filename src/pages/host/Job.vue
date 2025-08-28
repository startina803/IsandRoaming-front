<!-- src/pages/host/job.vue -->
<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card style="border:1px solid #3B7D96 !important;box-shadow: 10px 10px 0px rgba(60,125,150,0.5);padding:1.5rem;">
          <!-- 調整標題區塊，加入編輯按鈕 -->
          <v-card-title class="d-flex align-center justify-space-between w-100">
            <!-- 標題文字修改並套用主色調 -->
            <span class="headline text-primary">{{ isEditing ? '換宿工作' : '發布換宿工作' }}</span>
            <v-btn
              v-if="!isFormEditable && isEditing"
              color="primary"
              icon
              size="small"
              @click="isFormEditable = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form v-model="formValid" @submit.prevent="saveJob">

              <!-- 主要照片顯示區 -->
              <v-row v-if="mainPhotoUrl" class="mb-4" justify="center">
                <v-col class="d-flex justify-center align-center" cols="12" md="4">
                  <v-img
                    aspect-ratio="1"
                    class="rounded-lg elevation-4"
                    contain
                    :src="mainPhotoUrl"
                  />
                </v-col>
              </v-row>

              <!-- 照片縮圖列，包含刪除按鈕 -->
              <v-row v-if="displayedPhotos.length > 0" class="mb-2" justify="center">
                <v-col
                  v-for="(photo, index) in displayedPhotos"
                  :key="`photo-${photo.key}`"
                  class="d-flex justify-center photo-thumbnail-container"
                  cols="auto"
                >
                  <v-img
                    aspect-ratio="1"
                    class="rounded-lg photo-thumbnail"
                    :class="{ 'active': photo.url === mainPhotoUrl }"
                    :src="photo.url"
                    @click="mainPhotoUrl = photo.url"
                  />
                  <!-- 刪除按鈕，只在編輯模式下顯示 -->
                  <v-btn
                    v-if="isFormEditable"
                    class="delete-btn"
                    color="red"
                    icon
                    size="small"
                    variant="plain"
                    @click.stop="deletePhoto(index)"
                  >
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <!-- 上傳照片輸入，只在編輯模式顯示 -->
              <v-file-input
                v-if="isFormEditable"
                ref="fileInputRef"
                :disabled="allPhotos.length >= maxPhotos"
                label="上傳旅宿照片"
                :multiple="true"
                variant="outlined"
                @change="handleFileChange"
              >
                <template #message>
                  <div class="mt-2 text-center text-subtitle-2 text-medium-emphasis">
                    目前已選 {{ allPhotos.length }} 張，最多可上傳 {{ maxPhotos }} 張。
                  </div>
                </template>
              </v-file-input>
              <!-- 非編輯模式時的提示 -->
              <div v-else class="mb-4 text-center">
                <p class="text-subtitle-1 text-medium-emphasis">如需修改照片，請點擊標題旁的<v-icon color="primary" icon="mdi-pencil" />按鈕進入編輯模式。</p>
              </div>

              <v-text-field
                v-model="job.title"
                label="旅宿名稱"
                :readonly="!isFormEditable"
                required
                :rules="[v => !!v || '旅宿名稱是必填的']"
                variant="outlined"
              />

              <v-select
                v-model="job.location"
                :items="locationItems"
                label="旅宿地區"
                :readonly="!isFormEditable"
                required
                :rules="[v => !!v || '旅宿地點是必填的']"
                variant="outlined"
              />

              <v-text-field
                v-model="job.detailedLocation"
                label="旅宿地點"
                placeholder="例如：新北市淡水區中正路一段"
                :readonly="!isFormEditable"
                variant="outlined"
              />

              <v-text-field
                v-model="job.workPeriod"
                label="換宿時間"
                placeholder="例如：2025年9月/10月/11月"
                :readonly="!isFormEditable"
                variant="outlined"
              />

              <v-text-field
                v-model="job.requiredPeopleCount"
                label="需求人數"
                placeholder="例如：2或 '3-4"
                :readonly="!isFormEditable"
                required
                :rules="[v => !!v || '需求人數是必填的']"
                variant="outlined"
              />

              <v-textarea
                v-model="job.workContent"
                label="工作內容"
                placeholder="例如：（列點呈現）
◆工作日工時4小時，每天視訂房情況彈性調整工作內容
（每週平日休一天，未滿一週無休假）
◆整理清掃公共區域
◆餵五隻店貓（早晚清貓砂）
◆頂樓植物澆水
◆房務（鋪床）工作
◆洗烘床單
◆丟垃圾"
                :readonly="!isFormEditable"
                variant="outlined"
              />

              <v-textarea
                v-model="job.helperBenefits"
                label="小幫手福利 "
                placeholder="例如：（列點呈現）
◆住宿環境，四人上下舖背包房，有冷暖氣、洗衣機、烘衣機、衛浴共用
◆提供機車（兩人使用一台，油錢自付，限小幫手使用）
◆無供三餐但隨時會有好料分享（有廚房可自行開伙）
◆無特別之事時可自由安排時間做自己的事
◆可提供衝浪練習板使用（衝浪教學可衝浪街詢問）
◆滿ㄧ個月者另提供零用金和龜山島三合一/飛行傘擇一（需視當月天氣狀況）"
                :readonly="!isFormEditable"
                variant="outlined"
              />

              <v-textarea
                v-model="job.notes"
                label="備註"
                placeholder="例如：（列點呈現）
◆需年滿二十歲，且家長同意。(未滿需有家長同意書）
◆需具備機車駕照。（ㄧ定要會騎機車）
◆民宿內有五隻店貓，不喜毛孩者請勿試。（有常備不含類固醇的過敏藥）
◆海邊難免有蚊蟲叮咬，不喜者勿試。
◆因過往經驗皆不佳，目前不接受朋友共同換宿
◆換宿適應期為ㄧ週（若不如預期所望，皆可提前告知結束配合）"
                :readonly="!isFormEditable"
                variant="outlined"
              />

              <v-text-field
                v-model="job.socialLink"
                label="社群或是官網"
                placeholder="例如: https://instagram.com/"
                :readonly="!isFormEditable"
                :rules="[v => !v || isValidUrl(v) || '請輸入有效的網址']"
                variant="outlined"
              />

              <!-- 只有在編輯模式才顯示上架開關 -->
              <v-switch
                v-if="isEditing"
                v-model="job.status"
                color="primary"
                :disabled="!isFormEditable"
                false-value="closed"
                inset
                label="發佈此工作"
                true-value="open"
              />

              <!-- 動作按鈕，根據狀態動態顯示 -->
              <v-row class="mt-4">
                <v-col cols="6" offset="3">
                  <v-btn
                    v-if="isFormEditable"
                    block
                    class="ma-2"
                    color="primary"
                    :disabled="!formValid || loading || allPhotos.length > maxPhotos"
                    :loading="loading"
                    type="submit"
                  >
                    保存修改
                  </v-btn>
                  <v-btn
                    v-else
                    block
                    class="ma-2"
                    color="primary"
                    @click="isFormEditable = true"
                  >
                    編輯
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import jobService from '@/services/job.js'

  const createSnackbar = useSnackbar()

  const formValid = ref(false)
  const loading = ref(false)
  const isEditing = ref(false)
  const isFormEditable = ref(false)

  const job = ref({
    _id: '',
    title: '',
    location: '',
    detailedLocation: '',
    workPeriod: '',
    requiredPeopleCount: '',
    photos: [],
    workContent: '',
    helperBenefits: '',
    notes: '',
    socialLink: '',
    status: 'closed',
  })

  // 新的圖片管理陣列
  // 每個物件包含 { key: unique_id, url: display_url, file: File | null }
  const allPhotos = ref([])
  const maxPhotos = 5 // 最大允許的圖片數量

  // 用於顯示的 computed 屬性
  const displayedPhotos = computed(() => {
    return allPhotos.value.map(photo => ({
      key: photo.key,
      url: photo.url,
    }))
  })

  const mainPhotoUrl = ref(null)
  watch(displayedPhotos, newPhotos => {
    if (!mainPhotoUrl.value || !newPhotos.some(p => p.url === mainPhotoUrl.value)) {
      mainPhotoUrl.value = newPhotos.length > 0 ? newPhotos[0].url : null
    }
  })

  const locationItems = [
    '台北', '新北', '桃園', '台中', '台南', '高雄', '新竹', '苗栗',
    '彰化', '南投', '雲林', '嘉義', '屏東', '宜蘭', '花蓮', '台東',
    '澎湖', '金門', '連江', '基隆', '新竹', '嘉義', '綠島', '小琉球',
    '蘭嶼', '馬祖',
  ]

  const isValidUrl = url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 處理檔案上傳的事件
  const handleFileChange = event => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    const availableSlots = maxPhotos - allPhotos.value.length

    if (newFiles.length > availableSlots) {
      createSnackbar({ text: `最多只能再上傳 ${availableSlots} 張照片`, snackbarProps: { color: 'red' } })
    }

    for (const file of newFiles.slice(0, availableSlots)) {
      allPhotos.value.push({
        key: Date.now() + Math.random(), // 唯一鍵
        url: URL.createObjectURL(file), // 預覽網址
        file: file, // 檔案物件本身
      })
    }

    // 清空 v-file-input 的值，以允許再次上傳相同檔案
    event.target.value = ''
  }

  // 刪除照片的方法
  const deletePhoto = index => {
    const photo = allPhotos.value[index]
    if (photo && photo.url && photo.url.startsWith('blob:')) {
      URL.revokeObjectURL(photo.url)
    }
    allPhotos.value.splice(index, 1)
  }

  // 儲存或建立工作
  const saveJob = async () => {
    loading.value = true
    try {
      if (!formValid.value || allPhotos.value.length > maxPhotos) {
        createSnackbar({ text: '請檢查所有欄位及照片數量', snackbarProps: { color: 'red' } })
        return
      }

      const fd = new FormData()
      fd.append('title', job.value.title)
      fd.append('location', job.value.location)
      fd.append('detailedLocation', job.value.detailedLocation)
      fd.append('workPeriod', job.value.workPeriod)
      fd.append('requiredPeopleCount', job.value.requiredPeopleCount)
      fd.append('notes', job.value.notes)
      fd.append('socialLink', job.value.socialLink)
      fd.append('workContent', job.value.workContent)
      fd.append('helperBenefits', job.value.helperBenefits)

      const photosToKeep = []
      const newFiles = []

      // 遍歷所有照片，區分舊網址和新檔案
      for (const photo of allPhotos.value) {
        if (photo.file) {
          newFiles.push(photo.file)
        } else if (photo.url) {
          photosToKeep.push(photo.url)
        }
      }

      // 只有在編輯模式下，才需要傳送舊照片列表
      if (isEditing.value) {
        fd.append('status', job.value.status)
        fd.append('photosToKeep', JSON.stringify(photosToKeep))
      } else {
        // 如果是新增模式，需要檢查是否有照片
        if (newFiles.length === 0) {
          createSnackbar({ text: '新增工作必須上傳至少一張照片', snackbarProps: { color: 'red' } })
          loading.value = false
          return
        }
        fd.append('status', 'open')
      }

      // 將新檔案添加到 FormData
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          fd.append('images', file)
        }
      }

      const { data } = await (isEditing.value ? jobService.updateJob(job.value._id, fd) : jobService.createJob(fd))

      console.log('--- SAVE JOB: Backend response ---', JSON.stringify(data, null, 2))
      createSnackbar({ text: `工作${isEditing.value ? '修改' : '新增'}成功`, snackbarProps: { color: 'green' } })

      if (data.result) {
        Object.assign(job.value, data.result)
        isEditing.value = true

        // 儲存成功後，使用後端回傳的永久網址更新 allPhotos 陣列
        allPhotos.value = (job.value.photos || []).map(url => ({
          key: Date.now() + Math.random(),
          url: url,
          file: null,
        }))

        mainPhotoUrl.value = allPhotos.value.length > 0 ? allPhotos.value[0].url : null
      }

      isFormEditable.value = false
    } catch (error) {
      console.error('Save job error:', error)
      createSnackbar({ text: error.response?.data?.message || `工作${isEditing.value ? '修改' : '新增'}失敗`, snackbarProps: { color: 'red' } })
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    loading.value = true
    try {
      const { data } = await jobService.getMyJobs()
      console.log('--- ON MOUNTED: Backend data ---', JSON.stringify(data, null, 2))
      if (data.result && data.result.length > 0) {
        isEditing.value = true
        Object.assign(job.value, data.result[0])

        // 確保都是字串
        job.value.workContent = Array.isArray(job.value.workContent) ? job.value.workContent.join('\n') : (job.value.workContent || '')
        job.value.helperBenefits = Array.isArray(job.value.helperBenefits) ? job.value.helperBenefits.join('\n') : (job.value.helperBenefits || '')
        job.value.notes = Array.isArray(job.value.notes) ? job.value.notes.join('\n') : (job.value.notes || '')

        // 載入舊照片到新的 allPhotos 陣列
        allPhotos.value = (job.value.photos || []).map(url => ({
          key: Date.now() + Math.random(),
          url: url,
          file: null,
        }))

        if (allPhotos.value.length > 0) {
          mainPhotoUrl.value = allPhotos.value[0].url
        }
        isFormEditable.value = false // 載入現有工作時，預設為檢視模式
      } else {
        // 沒有現有工作，預設為新增模式
        isEditing.value = false
        isFormEditable.value = true
      }
    } catch (error) {
      console.error('找不到現有工作或載入失敗:', error)
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: bold;
}

.headline-with-edit {
  display: flex;
  align-items: center;
}

.photo-thumbnail-container {
  position: relative;
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
  border-color: #1976D2; /* Vuetify primary color */
}

.delete-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10;
  /* 移除背景色和不透明度，讓按鈕更簡潔 */
  background-color: transparent;
  opacity: 1;
  border-radius: 50%;
}
</style>
