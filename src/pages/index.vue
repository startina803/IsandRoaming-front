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
        <v-row class="windows-row" justify="center">
          <v-col
            v-for="advantage in advantages"
            :key="advantage.id"
            cols="10"
            lg="2"
            md="3"
            sm="8"
          >
            <div class="window-frame">
              <div class="advantage-card" :class="{ 'is-open': advantage.isOpen }" @click="toggleWindow(advantage)">
                <div class="window-pane">
                  <span class="shutter-text">{{ advantage.text }}</span>
                  <div class="window-handle" />
                </div>
                <div class="advantage-content">
                  <v-img class="advantage-image" cover :src="advantage.image" />
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

  import advantageImg2 from '@/assets/images/friend.jpg'
  import advantageImg3 from '@/assets/images/happy.jpg'
  // 1. 從本地端 assets 匯入圖片
  import advantageImg1 from '@/assets/images/jump.jpg' // 請確保圖片路徑正確
  import advantageImg4 from '@/assets/images/play.jpeg'

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
  // 2. 將 image 的值從 URL 字串換成上面匯入的圖片變數
  const advantages = ref([
    { id: 1, text: '跳脫舒適', image: advantageImg1, isOpen: false },
    { id: 2, text: '結交新友', image: advantageImg2, isOpen: false },
    { id: 3, text: '出走解憂', image: advantageImg3, isOpen: false },
    { id: 4, text: '深入在地', image: advantageImg4, isOpen: false },
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
  background-image: url('@/assets/images/main.jpg'); /* 確保 main.jpg 在 src/assets/images/ 資料夾中 */
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
  padding: 40px 20px;
  /* ⭐️ 將背景改為主色系，更有整體感 */
  background-color: #3b7d96;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: white;
  font-weight: bold;
  position: relative; /* 為了 ::before 偽元素定位 */
  padding-bottom: 10px; /* 為上方的白色區塊留出空間 */
}

/* ⭐️ 新增：標題上方的白色裝飾，模仿火車行李架或燈條 */
.section-title::before {
  content: '';
  position: absolute;
  bottom:-10%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
}

.window-frame {
  background-color: rgb(255, 255, 255); /* ⭐️ 1. 改變這裡可以調整「窗框」的顏色 */
  padding: 10px; /* ⭐️ 2. 改變這裡可以調整「窗框」的厚度 */
  border-radius: 15px; /* 窗框的圓角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 0 auto; /* 在小螢幕上置中 */
}

.window-frame:hover {
  transform: scale(1.05);
}

/* ⭐️ 新增：窗戶下方的線條，模仿火車窗下的檯面或扶手 */
.windows-row {
  position: relative;
  padding-bottom: 30px; /* 為下方的線條留出空間 */
}
.windows-row::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 5%; /* 讓線條左右留點空隙 */
  right: 5%;
  height: 4px;
  background: linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.8), rgba(255,255,255,0.2)); /* 讓線條有點漸層感 */
  border-radius: 2px;
}

.advantage-card {
  position: relative;
  aspect-ratio: 4 / 3; /* 調整這裡可以改變窗戶的形狀 (寬高比) */
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px; /* 窗戶本身的圓角，比窗框小 */
}

/* ⭐️ 修改：將上下窗扇改為單一向上掀的窗格 */
.window-pane {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* ⭐️ 3. 改變這裡可以調整「窗戶本身」的顏色和透明度 */
  background-color: rgba(10, 25, 41, 0.5); /* 例如: rgba(100, 50, 20, 0.7) */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 2;
}

.shutter-text {
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.advantage-card.is-open .advantage-image {
  /* 窗戶打開時，圖片稍微放大 */
  transform: scale(1.1);
}

/* ⭐️ 新增：窗戶把手的樣式 */
.window-handle {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 8px;
  background-color: rgb(255, 89, 0);
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* ⭐️ 修改："打開" 狀態的動畫，讓窗格向上移動 */
.advantage-card.is-open .window-pane {
  transform: translateY(-100%);
}

.advantage-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* ⭐️ 新增：確保圖片填滿容器並加上動畫效果 */
.advantage-image {
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); /* 圖片放大動畫，時間與窗戶開啟一致 */
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
