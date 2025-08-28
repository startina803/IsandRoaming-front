<template>
  <div>
    <div class="hero-section">
      <div class="text-container">
        <h1 class="animated-text">{{ displayedText }}<span class="cursor" /></h1>
      </div>
      <!-- ⭐️ 新增：向下滾動提示箭頭 -->
      <div class="scroll-down-indicator" @click="scrollToContent">
        <v-icon size="x-large">mdi-chevron-down</v-icon>
      </div>
    </div>
    <!-- 換宿優點區塊 -->
    <div class="advantages-section">
      <v-container>
        <h2 class="section-title">換宿的四大理由</h2>
        <v-row justify="center">
          <v-col
            v-for="advantage in advantages"
            :key="advantage.id"
            cols="12"
            md="3"
            sm="6"
          >
            <div class="window-frame">
              <div class="advantage-card" :class="{ 'is-open': advantage.isOpen }" @click="toggleWindow(advantage)">
                <div class="shutter-top">
                  <span class="shutter-text">{{ advantage.topText }}</span>
                </div>
                <div class="shutter-bottom">
                  <span class="shutter-text">{{ advantage.bottomText }}</span>
                </div>
                <div class="advantage-content">
                  <v-img cover :src="advantage.image" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  const fullText = '你準備搭上藍皮解憂列車惹嗎?'
  const displayedText = ref('')
  let index = 0

  onMounted(() => {
    const typeWriter = () => {
      if (index < fullText.length) {
        displayedText.value += fullText.charAt(index)
        index++
        setTimeout(typeWriter, 150) // 可調整打字速度 (毫秒)
      }
    }
    // 延遲一下再開始打字，讓頁面載入更流暢
    setTimeout(typeWriter, 500)
  })

  // 換宿優點的資料
  const advantages = ref([
    // ⭐️ 請將下面的 image URL 換成您自己的圖片路徑
    { id: 1, topText: '跳脫', bottomText: '舒適', image: 'https://images.unsplash.com/photo-1528920304239-62a2de2b5546?q=80&w=1974', isOpen: false },
    { id: 2, topText: '結交', bottomText: '新友', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832', isOpen: false },
    { id: 3, topText: '出走', bottomText: '解憂', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2940', isOpen: false },
    { id: 4, topText: '深入', bottomText: '在地', image: 'https://images.unsplash.com/photo-1593675462801-e52c5f3b333a?q=80&w=2940', isOpen: false },
  ])

  // 點擊窗戶時觸發的函式
  const toggleWindow = clickedAdvantage => {
    clickedAdvantage.isOpen = !clickedAdvantage.isOpen
  }

  // ⭐️ 新增：滾動到內容區塊的函式
  const scrollToContent = () => {
    const contentSection = document.querySelector('.advantages-section')
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
</script>

<style scoped>
.hero-section {
  /* 1. 設定背景圖片和視差效果 */
  background-image: url('@/assets/main.jpg'); /* 確保 main.jpg 在 src/assets/ 資料夾中 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* ⭐️ 這是實現視差效果的關鍵 */
  position: relative; /* ⭐️ 讓絕對定位的子元素 (箭頭) 相對於此容器 */

  /* 2. 讓區塊佔滿整個可視高度 (減去導覽列高度) */
  height: calc(100vh - 80px); /* 假設導覽列高度為 80px，請依實際情況調整 */

  /* 3. 使用 Flexbox 將內容垂直和水平置中 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* ⭐️ 新增：向下滾動提示箭頭的樣式 */
.scroll-down-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  animation: float 2s infinite ease-in-out;
  transition: color 0.3s ease;
}

.scroll-down-indicator:hover {
  color: white;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, 0px);
  }
  50% {
    transform: translate(-50%, 10px);
  }
}
/* 換宿優點區塊樣式 */
.advantages-section {
  padding: 80px 20px;
  /* ⭐️ 將背景改為主色系，更有整體感 */
  background-color: #3b7d96;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: white; /* ⭐️ 標題改為白色以適應深色背景 */
  font-weight: bold;
}

.window-frame {
  background-color: rgb(255, 255, 255); /* ⭐️ 1. 改變這裡可以調整「窗框」的顏色 */
  padding: 10px; /* ⭐️ 2. 改變這裡可以調整「窗框」的厚度 */
  border-radius: 15px; /* 窗框的圓角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 0 auto; /* 在小螢幕上置中 */
  max-width: 300px; /* ⭐️ 調整這裡可以改變窗戶的整體大小 */
}

.window-frame:hover {
  transform: scale(1.05);
}

.advantage-card {
  position: relative;
  aspect-ratio: 4 / 3; /* 調整這裡可以改變窗戶的形狀 (寬高比) */
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px; /* 窗戶本身的圓角，比窗框小 */
}

.shutter-top,
.shutter-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  /* ⭐️ 3. 改變這裡可以調整「窗戶本身」的顏色和透明度 */
  background-color: rgba(10, 25, 41, 0.5); /* 例如: rgba(100, 50, 20, 0.7) */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1); /* 動畫效果 */
  z-index: 2;
}

.shutter-top {
  top: 0;
  /* ⭐️ 4. 改變這裡可以調整「上半部窗戶」的下邊框 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 格式: [粗細] [樣式] [顏色] */
}

.shutter-bottom {
  bottom: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* ⭐️ 5. 改變這裡可以調整「下半部窗戶」的上邊框 */
}

.shutter-text {
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

/* "打開" 狀態的動畫 */
.advantage-card.is-open .shutter-top {
  transform: translateY(-100%);
}
.advantage-card.is-open .shutter-bottom {
  transform: translateY(100%);
}

.advantage-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.text-container {
  /* 增加一個半透明的背景，讓文字更突出 */
  background-color: rgba(0, 0, 0, 0.4);
  padding: 2rem 3rem;
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.animated-text {
  /* 文字樣式 */
  color: white;
  font-size: 3rem; /* 調整字體大小 */
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8); /* 文字陰影增加可讀性 */
  font-family: 'Noto Sans TC', sans-serif; /* 推薦使用思源黑體，或其他適合的字體 */
  white-space: nowrap; /* 確保文字在同一行 */
}

/* 閃爍的游標 */
.cursor {
  display: inline-block;
  width: 3px;
  height: 3.2rem; /* 與字體大小匹配 */
  background-color: white;
  margin-left: 8px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 響應式設計：在小螢幕上調整字體大小 */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  .shutter-text {
    font-size: 1.8rem;
  }
  .animated-text {
    font-size: 1.8rem;
  }
  .cursor {
    height: 2rem;
  }
  .text-container {
    padding: 1.5rem 2rem;
    background-color: rgba(0, 0, 0, 0.5); /* 在小螢幕上加深背景以提高可讀性 */
  }
}

@media (max-width: 480px) {
  .advantage-card {
    margin-bottom: 24px;
  }
  .animated-text {
    font-size: 1.3rem;
  }
  .cursor {
    height: 1.5rem;
  }
}

</style>
