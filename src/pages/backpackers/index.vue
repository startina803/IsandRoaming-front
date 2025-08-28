<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="9">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 text-primary font-weight-bold mb-4">尋找小幫手</h1>
            <p class="text-subtitle-1 mb-6">在這裡尋找符合您需求的打工換宿夥伴！</p>
          </v-col>
        </v-row>

        <!-- Filter Bar -->
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedLocation"
              clearable
              density="compact"
              :items="locationItems"
              label="篩選期望地點"
              variant="outlined"
              @update:model-value="fetchBackpackers"
            />
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="loading" class="text-center pa-12">
          <v-progress-circular color="primary" indeterminate size="64" />
        </v-row>

        <!-- Error State -->
        <v-row v-else-if="error">
          <v-col>
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
        </v-row>

        <!-- No Results State -->
        <v-row v-else-if="backpackers.length === 0">
          <v-col class="text-center pa-12">
            <v-icon color="grey-lighten-1" size="64">mdi-account-search-outline</v-icon>
            <p class="mt-4 text-h6 text-grey">找不到符合條件的小幫手</p>
          </v-col>
        </v-row>

        <!-- Content Grid -->
        <v-row v-else>
          <v-col
            v-for="backpacker in backpackers"
            :key="backpacker._id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <BackpackerCard :backpacker="backpacker" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import jobService from '@/services/job.js'
  import userService from '@/services/user.js'
  import { useUserStore } from '@/stores/user'
  // BackpackerCard is auto-imported by unplugin-vue-components
  const backpackers = ref([])
  const loading = ref(true)
  const error = ref(null)
  const selectedLocation = ref(null)

  const user = useUserStore()
  const locationItems = new Set([
    '台北', '新北', '桃園', '台中', '台南', '高雄', '新竹', '苗栗',
    '彰化', '南投', '雲林', '嘉義', '屏東', '宜蘭', '花蓮', '台東',
    '澎湖', '金門', '連江', '基隆', '綠島', '小琉球', '蘭嶼', '馬祖',
  ])

  const fetchBackpackers = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await userService.getPublicBackpackers(selectedLocation.value)
      backpackers.value = data.result
    } catch (error_) {
      console.error('Failed to fetch backpackers:', error_)
      error.value = '載入資料失敗，請稍後再試。'
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    // 如果是旅宿業者登入，嘗試從他們的工作中設定預設地點
    if (user.isLogin && user.identity === 'host') {
      try {
        const { data } = await jobService.getMyJobs()
        if (data.result.length > 0) {
          const hostLocation = data.result[0].location
          // 直接使用旅宿業者的地點作為預設篩選條件。
          // 這假設 hostLocation 的值 (例如 "綠島") 已經是 locationItems 的其中一項。
          if (locationItems.has(hostLocation)) {
            selectedLocation.value = hostLocation
          }
        }
      } catch (error_) {
        console.error('Failed to fetch host jobs for default location:', error_)
        // 即使抓取失敗，也繼續執行，不影響主要功能
      }
    }

    // 根據設定好的地點（如果有的話）或預設（全部）來抓取背包客資料
    await fetchBackpackers()
  })
</script>
