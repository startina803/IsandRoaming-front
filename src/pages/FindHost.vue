//src/Pages/FindHost.vue
<template>
  <v-container>
    <v-row justify="center">
      <v-col class="pb-0" cols="12" lg="6" md="8">
        <!-- <h1 class="text-center my-4">尋找換宿</h1> -->
        <p class="mt-5 mb-0 text-primary font-weight-bold">請點擊地圖上的地區來查看換宿工作</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <TaiwanMap :selected-county="selectedCounty" @county-selected="handleCountySelection" />
      </v-col>
      <!-- 調整 md="5" 讓列表寬度適中，您可以視情況調整為 6 -->
      <v-col class="job-list-column" cols="12" md="5">
        <JobList :county="selectedCounty" :error="error" :jobs="jobs" :loading="loading" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import JobList from '@/components/JobList.vue'
  import TaiwanMap from '@/components/TaiwanMap.vue'
  import jobService from '@/services/job.js' // 引入我們之前討論的 API 服務

  export default {
    name: 'FindHostPage',
    components: {
      TaiwanMap,
      JobList,
    },
    data () {
      return {
        selectedCounty: null,
        jobs: [],
        loading: false, // 用於顯示載入狀態
        error: null,
      }
    },
    methods: {
      // 處理地圖元件傳來的地區選擇事件
      async handleCountySelection (countyName) {
        if (this.selectedCounty === countyName) {
          // 如果點擊同一個地區，就清空資料
          this.selectedCounty = null
          this.jobs = []
          return
        }

        // selectedCounty 儲存的是要顯示在前端的名稱 (例如 "馬祖")
        this.selectedCounty = countyName
        this.loading = true // 開始載入
        this.error = null // 清除錯誤訊息

        // 建立一個名稱對照表，處理前後端名稱不一致的問題
        const nameMap = {
          馬祖: '連江',
        }
        // 如果點擊的縣市在對照表中，就使用轉換後的名稱去呼叫 API，否則使用原名
        const apiCountyName = nameMap[countyName] || countyName

        try {
          // 向後端請求特定地區的工作資料
          const { data } = await jobService.getJobsByCounty(apiCountyName)
          // 後端回傳的資料通常在 result 屬性中，且最好是個陣列
          this.jobs = data.result || []
        } catch (error) {
          // ⭐️ 修正：更穩健的錯誤處理
          // 將工作列表清空
          this.jobs = []

          // 在開發者控制台印出詳細錯誤，方便除錯
          console.error('載入工作時發生錯誤:', error)

          // 判斷錯誤來源並設定對應的錯誤訊息
          // 如果後端有回傳錯誤訊息，就顯示它；否則顯示通用訊息。
          const errorMessage = error.response?.data?.message || '無法載入工作資料，請稍後再試。'
          this.error = errorMessage
        } finally {
          this.loading = false // 結束載入
        }
      },
    },
  }
</script>

<style scoped>
/* 可以根據需要添加樣式 */
/* 這是控制長分隔線的樣式 */
.job-list-column {
  /* 使用 @media 確保這些樣式只在桌面版 (md breakpoint: 960px) 生效 */
  @media (min-width: 960px) {
    /* 1. 加上長的分隔線 (使用淡灰色，作為背景) */
    border-left: 2px solid #eee;

    /* 2. 調整長線與工作列表的整體距離 */
    /* 這個 padding 會把整個 JobList 元件往右推，為短橘線留出空間 */
    padding-left: 120px;
    padding-right: 120px;

  }
}
</style>
