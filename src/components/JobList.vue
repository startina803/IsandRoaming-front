<template>
  <div class="timetable-board">
    <h2 class="station-name">{{ title }}</h2>

    <div v-if="loading" class="text-center">
      <v-progress-circular color="primary" indeterminate />
      <p>載入中...</p>
    </div>

    <div v-else-if="error" class="text-center text-red">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!county">
      <p class="text-center mt-3">請點擊左方地圖選擇車站</p>
    </div>

    <div v-else-if="jobs.length === 0">
      <p class="text-center mt-3">目前 {{ county }} 沒有可用的換宿工作。</p>
    </div>

    <v-list v-else class="schedule-list" lines="one">
      <template v-for="job in jobs" :key="job._id">
        <v-list-item link :to="'/jobs/' + job._id">
          <div class="schedule-row">
            <div class="train-type">換宿</div>
            <div class="destination">{{ job.title }}</div>
            <div class="platform"><v-icon>mdi-chevron-right</v-icon></div>
          </div>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  // ⭐️ 使用 defineProps 來定義從父元件接收的資料
  const props = defineProps({
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
  })

  // ⭐️ 使用 computed 來定義標題
  const title = computed(() => {
    return props.county ? `${props.county} 車站` : '列車總覽'
  })
</script>

<style scoped>
/* ⭐️ 全新時刻表樣式 */
.timetable-board {
  /* ⭐️ 修改：加上 position: relative 和 overflow: hidden 以便容納偽元素動畫 */
  position: relative;
  overflow: hidden;
  background: #f1f2f3;
  /* border: 1px solid #4a4a4a; 深灰色邊框，增加實體感 */
  border-radius: 3px;
  padding: 16px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.6), inset 0 0 2px rgba(0, 0, 0, 0.7);
  min-height: 400px;
  font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif; /* 優先使用更清晰的黑體 */
}

/* ⭐️ 新增：定義掃描線動畫 */
@keyframes scanline-animation {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* ⭐️ 新增：使用 ::after 偽元素來建立掃描線效果 */
.timetable-board::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(180, 220, 255, 0) 0%, rgba(180, 220, 255, 0.05) 50%, rgba(180, 220, 255, 0) 100%);
  background-size: 100% 4px; /* 掃描線的高度 */
  opacity: 0.4;
  pointer-events: none; /* 確保動畫不會影響滑鼠點擊 */
  animation: scanline-animation 8s linear infinite;
}

/* 車站 */
.station-name {
  color: #3B7D96;
  font-family: 'KaiTi', 'BiauKai', serif; /* 使用楷體，模仿車站招牌的書法字 */
  font-size: 2.2rem;
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 2px solid #3B7D96;
  text-shadow: 0 0 5px #3B7D96; /* 增加光暈效果 */
}

/* 提示文字樣式 */
.timetable-board p {
  color: #5b5656; /* 淡藍色文字，在深色背景上很清晰 */
  font-size: 1.1rem;
  padding-top: 40px;
}

/* 移除 v-list 的預設背景 */
.timetable-board :deep(.v-list) {
  background: transparent !important;
  padding: 0;
}

/* ⭐️ 核心修正：將 v-list-item 本身變為透明，我們只樣式化內部的 .schedule-row */
.timetable-board :deep(.v-list-item) {
  background: transparent !important;
  padding: 0 !important; /* 移除 v-list-item 的內邊距 */
  margin-bottom: 8px;
}

/* ⭐️ 將樣式應用到我們自己的 div 上，而不是 v-list-item */
.schedule-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 8px;
  color: #e0e0e0;
  border-radius: 2px; /* 圓角加在這裡 */
  /* ⭐️ 修改：將預設背景色改為帶有 20% 透明度的黑色，讓對比更強烈 */
  background-color: rgba(167, 167, 167, 0.2);
  transition: background-color 0.3s;
}

/* ⭐️ Hover 效果作用在 .schedule-row 上 */
.timetable-board :deep(.v-list-item:hover) .schedule-row {
  background-color: #f3d49c; /* Hover 時的深灰色 */
}

.train-type {
  flex: 0 0 70px;
  font-weight: bold;
  color: #ee9b00; /* 橘色，類似莒光號 */
  text-align: center;
  font-size: 1.1rem;
}

/* 看板裡面的工作 */
.destination {
  flex: 1 1 auto;
  padding: 0 16px;
  font-size: 1.2rem;
  color: #545353;
  /* text-shadow: 0 0 4px #000000; 增加光暈效果 */
  font-family: 'KaiTi', 'BiauKai', serif;
  font-weight: bold; /* ⭐️ 將字體加粗 */
}

.platform {
  flex: 0 0 40px;
  text-align: right;
}

.platform .v-icon {
  color: #ee9b00;
  transition: transform 0.2s;
}

.timetable-board :deep(.v-list-item:hover .platform .v-icon) {
  transform: translateX(5px);
}

.timetable-board .text-red {
  color: #e74c3c !important;
}
</style>
