<template>
  <div class="job-list-container">
    <h2 class="text-center text-primary">{{ title }}</h2>

    <div v-if="loading" class="text-center">
      <v-progress-circular color="primary" indeterminate />
      <p>載入中...</p>
    </div>

    <div v-else-if="error" class="text-center text-red">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!county">
      <p class="text-center mt-3">可以查看有興趣的工作並投遞履歷</p>
    </div>

    <div v-else-if="jobs.length === 0">
      <p class="text-center mt-3">目前 {{ county }} 沒有可用的換宿工作。</p>
    </div>

    <v-list v-else lines="two">
      <template v-for="(job, index) in jobs" :key="job._id">
        <div class="job-item-wrapper">
          <v-list-item link :to="'/jobs/' + job._id">
            <v-list-item-title class="font-weight-bold">{{ job.title }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-icon class="mr-1" icon="mdi-map-marker" size="small" />
              {{ job.detailedLocation || job.location }}
            </v-list-item-subtitle>
            <template #append>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-list-item>
        </div>
        <v-divider v-if="index < jobs.length - 1" />
      </template>
    </v-list>
  </div>
</template>

<script>
  export default {
    name: 'JobList',
    props: {
      // 從父元件接收的資料
      county: {
        type: String,
        default: null,
      },
      jobs: {
        type: Array,
        default: () => [],
      },
      loading: {
        type: Boolean,
        default: false,
      },
      error: {
        type: String,
        default: null,
      },
    },
    computed: {
      title () {
        return this.county ? `${this.county} 的換宿工作` : '換宿工作列表'
      },
    },
  }
</script>

<style scoped>
.job-list-container {
  /* 移除這裡的 padding-left，間距現在由父層 FindHost.vue 控制 */
  min-height: 400px; /* 保持高度一致，防止頁面跳動 */
}

.job-item-wrapper {
  position: relative;
  /* 透過 padding-left 為左邊的短線留出空間 */
  padding-left: 24px;
}

/* 使用 ::before 偽元素來建立那條短線 */
.job-item-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  /* --- 您可以在這裡自由調整線的樣式 --- */
  height: 32px; /* 線的長度 */
  width: 4px; /* 線的粗細 */
  background-color: #ea914e; /* 橘色 */
  border-radius: 2px; /* 讓線的邊角變圓滑 */
}

/* 自訂 v-list-item 的 hover 效果 */
.job-item-wrapper :deep(.v-list-item--variant-text:hover > .v-list-item__overlay) {
  background-color: #ea914e;
  opacity: 0.08;
}
</style>
