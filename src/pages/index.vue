<template>
  <div>
    <div class="hero-section">
      <!-- ⭐️ 移除 v-if，讓標語永遠顯示 -->
      <div class="text-container">
        <h1 class="animated-text">{{ displayedText }}<span class="cursor" /></h1>
        <p class="slogan">一個為年輕人打造的打工換宿解憂平台</p>
      </div>
      <!-- ⭐️ 新增：向下滾動提示箭頭 -->
      <div class="scroll-down-indicator" @click="scrollToContent">
        <v-icon size="x-large">mdi-chevron-down</v-icon>
      </div>
    </div>
    <!-- 換宿優點區塊 -->
    <div class="advantages-section">
      <!-- ⭐️ 1. 新增一個 div 來專門放置火車頂部圖案 -->
      <div class="train-top-pattern" :style="{ backgroundImage: `url(${trainTopImg})` }" />
      <!-- ⭐️ 新增：將您的 Logo 放在左下角 -->
      <img alt="島嶼漫遊 Logo" class="train-side-logo" :src="trainLogoImg">
      <v-container>
        <v-row class="windows-row" justify="center" style="padding: 0;">
          <v-col
            v-for="advantage in advantages"
            :key="advantage.id"
            cols="10"
            lg="2"
            md="2"
            sm="8"
          >
            <div class="window-frame">
              <div class="advantage-card" :class="{ 'is-open': advantage.isOpen }" @mouseenter="openWindow(advantage)" @mouseleave="closeWindow(advantage)">
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
          <!-- ⭐️ 新增：火車門 -->
          <v-col cols="10" lg="2" md="2" sm="8">
            <div class="door-frame" :class="{ 'is-open': isDoorOpen }" @mouseenter="isDoorOpen = true" @mouseleave="isDoorOpen = false">
              <div class="door-leaf left">
                <div class="door-window" />
              </div>
              <div class="door-leaf right">
                <div class="door-window" />
              </div>
              <div class="door-content" :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trainInsideImg})` }">
                <span class="door-text">開始<br>旅程</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- ⭐️ 新增：關於島嶼漫遊介紹區塊 -->
    <!-- ⭐️ 合併：將火車動畫與此區塊結合 -->
    <div class="about-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="8" md="10">
            <h2 class="section-title-about">關於島嶼漫遊</h2>
            <div class="about-content-wrapper">
              <h3 class="about-subtitle">設計理念</h3>
              <p class="about-text">
                以藍皮列車的自由與懷舊為靈感，我們設計了一個讓年輕人踏上「解憂旅程」、跳脫日常的打工換宿平台。
              </p>

              <v-divider class="my-6" />

              <h3 class="about-subtitle">動機背景</h3>
              <p class="about-text">
                <strong>藍皮列車的歷史：</strong>
                擁有50年歷史的「藍皮普快車」，是全台唯一無冷氣、窗戶與車門可手動開啟的普快車。開啟窗戶，迎著自然風，欣賞遼闊海景與蓊鬱山景，帶來心曠神怡的體驗，素有「解憂火車」美名。
              </p>
              <p class="about-text">
                <strong>跳脫舒適圈的呼喚：</strong>
                我們渴望喚醒年輕人，鼓勵他們勇敢地離開舒適圈，透過旅行與工作體驗多元生活，深刻感受台灣在地文化的獨特魅力。
              </p>
              <p class="about-text">
                <strong>漫遊，而非旅遊：</strong>
                搭乘火車是一種漫遊，不似旅行僅幾天趕行程，無法真實體驗在地生活。火車一站一站，象徵著未知的下一站。你，是否也準備好啟程，跳脫舒適圈，探索更多元的人生？
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- ⭐️ 新增：下一步引導區塊，並將其作為火車動畫的容器 -->
    <div class="next-steps-wrapper">
      <v-container class="next-steps-container my-12">
        <v-row justify="center">
          <v-col class="text-center mb-8" cols="12">
            <h2 class="text-h4 font-weight-bold text-primary">
              準備好開始你的旅程了嗎？
            </h2>
            <p class="text-body-1 text-grey-darken-1 mt-2">
              無論你是尋找獨特體驗的背包客，還是需要幫手的店家，這裡都是你的起點。
            </p>
          </v-col>
        </v-row>

        <v-row class="mb-6" justify="center">
          <!-- 背包客卡片 -->
          <v-col cols="12" lg="4" md="5">
            <v-card class="pa-5 text-center" elevation="2">
              <v-icon class="mb-4" color="primary" size="64">mdi-briefcase-search-outline</v-icon>
              <v-card-title class="font-weight-bold">我是背包客</v-card-title>
              <v-card-text>
                打造你的專屬履歷，向心儀店家展現獨特魅力，開啟精彩的換宿之旅。
              </v-card-text>
              <v-btn color="primary" size="large" to="/register?role=backpacker" variant="flat">建立我的履歷</v-btn>
            </v-card>
          </v-col>

          <!-- 店家卡片 -->
          <v-col cols="12" lg="4" md="5">
            <v-card class="pa-5 text-center" elevation="2">
              <v-icon class="mb-4" color="secondary" size="64">mdi-store-plus-outline</v-icon>
              <v-card-title class="font-weight-bold">我是店家</v-card-title>
              <v-card-text>
                免費刊登換宿職缺，吸引各地優秀小幫手，為您的店舖注入新活力。
              </v-card-text>
              <v-btn color="secondary" size="large" to="/register?role=store" variant="flat">刊登換宿職缺</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <img alt="行駛中的火車" class="driving-train" :src="drivingTrainImg">
    </div>

    <!-- ⭐️ 新增：主色系 Footer -->
    <footer class="main-footer">
      <p>&copy; {{ new Date().getFullYear() }} 島嶼漫遊 Island Roaming. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import drivingTrainImg from '@/assets/images/driving_train.png'
  import advantageImg2 from '@/assets/images/friend.jpg'
  import advantageImg3 from '@/assets/images/happy.jpg'
  // 1. 從本地端 assets 匯入圖片
  import advantageImg1 from '@/assets/images/jump.jpg' // 請確保圖片路徑正確
  import advantageImg4 from '@/assets/images/play.jpeg'
  // ⭐️ 新增：匯入火車門內的背景圖片
  import trainInsideImg from '@/assets/images/train-inside.jpg' // 請確認圖片路徑
  // ⭐️ 新增：匯入您的 Logo 圖片
  import trainLogoImg from '@/assets/images/train_logo.png' // 請確認您的圖片路徑和檔名是否正確
  // 匯入您的火車車頂圖片
  import trainTopImg from '@/assets/images/train_top.png' // 請確認您的圖片路徑和檔名是否正確

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
  // ⭐️ 新增 timerId 屬性，用於追蹤自動關閉的計時器
  const advantages = ref([
    { id: 1, text: '跳脫舒適', image: advantageImg1, isOpen: false, timerId: null },
    { id: 2, text: '結交新友', image: advantageImg2, isOpen: false, timerId: null },
    { id: 3, text: '出走解憂', image: advantageImg3, isOpen: false, timerId: null },
    { id: 4, text: '深入在地', image: advantageImg4, isOpen: false, timerId: null },
  ])

  // ⭐️ 新增：門的開關狀態
  const isDoorOpen = ref(false)

  // ⭐️ 修改：將 toggleWindow 拆分為 open 和 close，以適應 hover
  const openWindow = clickedAdvantage => {
    // 清除可能存在的舊計時器，避免衝突
    clearTimeout(clickedAdvantage.timerId)
    clickedAdvantage.isOpen = true
  }

  const closeWindow = clickedAdvantage => {
    clickedAdvantage.isOpen = false
  }

  // 註解：門的開關邏輯已直接寫在 template 的 @mouseenter 和 @mouseleave 中，
  // 因此不再需要 toggleDoor 函式。

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
  height: calc(100vh - 15px); /* 假設導覽列高度為 80px，請依實際情況調整 */

  /* 3. 使用 Flexbox 將內容垂直和水平置中 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* ⭐️ 新增：為背景圖加上半透明白色疊加層 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.15); /* 15% 透明度的白色，您可以調整 0.15 這個值 */
  z-index: 1; /* 確保疊加層在背景圖之上 */
}

/* ⭐️ 新增：向下滾動提示箭頭的樣式 */
.scroll-down-indicator {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  animation: float 2s infinite ease-in-out;
  transition: color 0.3s ease;
  z-index: 2; /* 確保箭頭在疊加層之上 */
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

/* ⭐️ 新增：關於島嶼漫遊介紹區塊樣式 */
.about-section {
  /* ⭐️ 調整：移除為了火車動畫而設的樣式和額外 padding */
  padding: 60px 20px;
  background-color: #f4f7f9;
  text-align: center;
}

.section-title-about {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #3b7d96; /* 使用主色系 */
  font-weight: bold;
}

.about-content-wrapper {
  background-color: white;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  text-align: left; /* 內文靠左對齊，方便閱讀 */
}

.about-subtitle {
  font-size: 1.8rem;
  color: #ea914e; /* 使用輔助色 */
  margin-bottom: 16px;
  font-weight: 600;
  border-left: 5px solid #ea914e;
  padding-left: 15px;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

.next-steps-wrapper {
  position: relative;
  overflow-x: hidden;
  /* ⭐️ 新增：為火車動畫預留底部空間 */
  padding-bottom: 70px; /* 火車高度 */
}

.driving-train {
  position: absolute;
  /* ⭐️ 修改：將火車定位在父容器的底部 */
  bottom: 0;
  left: 0;
  /* ⭐️ 移除：不再需要 transform 來調整垂直位置 */
  /* transform: translateY(-100%); */
  height: 70px;
  /* 恢復為單一火車從左到右的動畫 */
  animation: driveAcross 25s linear infinite;
}

/* ⭐️ 新增：主色系 Footer 樣式 */
.main-footer {
  background-color: #3b7d96; /* 主色系 */
  color: white;
  /* ⭐️ 調整：恢復正常的 padding */
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
}

/* ⭐️ 恢復：定義單一火車行駛的動畫 */
@keyframes driveAcross {
  from {
    /* 從畫面左邊外側開始 */
    transform: translateX(-100%);
  }
  to {
    /* 移動到畫面右邊外側結束 */
    transform: translateX(100vw);
  }
}

/* 換宿優點區塊樣式 */
.advantages-section {
  /* ⭐️ 調整 padding-top，因為車頂圖案已移到區塊外部 */
  padding: 80px 20px 0px;
  /* ⭐️ 將背景改為主色系，更有整體感 */
  background-color: rgb(59, 125, 150);
  text-align: center;
  position: relative; /* 為了定位下方的圖案 */
  box-shadow: inset 0 0 50px 20px rgba(18, 81, 105, 0.8);
}

.train-top-pattern {
  position: absolute;
  /* ⭐️ 調整：增加高度並同步調整 top 值，讓圖案更大 */
  top: -55px; /* 向上移動自身高度的距離 */
  left: 0;
  width: 100%;
  height: 60px; /* ⭐️ 調整：增加圖案的高度 */
  background-repeat: repeat-x;
  background-size: auto 100%;
  background-position: center;
  /* ⭐️ 新增：使用 CSS filter 讓圖片更亮、更白 */
  filter: brightness(1.2);
  /* ⭐️ 新增：為車頂加上陰影，增加立體感 */
  box-shadow: inset 0 0px 15px 3px rgba(0, 0, 0, 0.5);
}

/* ⭐️ 新增：火車車身 Logo 的樣式 */
.train-side-logo {
  position: absolute;
  bottom: 12px; /* 距離底部 40px，您可以調整這個數值 */
  left: 20%;   /* ⭐️ 調整：使用百分比定位，使其在不同螢幕尺寸下位置更穩定 */
  height: 125px; /* 設定 Logo 的高度 */
  z-index: 2;   /* 確保它在背景之上 */
  opacity: 0.9; /* 讓 Logo 稍微融入背景，看起來更自然 */
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

  border-radius: 15px; /* 窗框的圓角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 0 auto; /* 在小螢幕上置中 */
  border:10px solid #595959;
  overflow: hidden;
}

.window-frame .advantage-card{
   transition: 0.3s;
}

.window-frame:hover .advantage-card{
   overflow: hidden;
  transform: scale(1.05);
}

/* ⭐️ 新增：窗戶下方的線條，模仿火車窗下的檯面或扶手 */
.windows-row {
  position: relative;
  padding-bottom: 30px; /* 為下方的線條留出空間 */
  /* ⭐️ 新增：讓內容物從頂部對齊，這樣門變高時才不會影響窗戶 */
  align-items: start;
}

/* 車身白線 */
.windows-row::after {
  content: '';
  position: absolute;
  /* ⭐️ 關鍵修改：調整 bottom 值來移動線條的垂直位置 */
  /* 數值越大，線條越往上。我們把它移到距離容器底部 30px 的地方 */
  bottom: 145px;
  left: 3%;
  right: 3%;
  height: 25px;
  background-color: white;
  border-radius: 2px;
  z-index: 1; /* 確保線條在門的後面 */
}

.door-frame {
  background-color: rgb(34, 63, 90); /* ⭐️ 調整：將門框顏色也改為深灰色，與窗框風格完全一致 */
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1),
  3px 2px 1px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  margin: 0 auto;
  position: relative;
  left:50px;
  /* ⭐️ 移除：移除寬高比，改為手動設定高度 */
  /* aspect-ratio: 4 / 5.5; */
  /* ⭐️ 關鍵修改：增加門的高度，讓它能向下延伸，穿過白線並貼齊底部 */
  height: 380px; /* 這個值約等於窗戶高度 + 線條上移的距離 */
  cursor: pointer;
  overflow: hidden;
  z-index: 2; /* 確保門在線條的上面 */
}

.door-leaf {
  position: absolute;
  top: 0; /* ⭐️ 新增：確保門片從門框頂部開始，貼齊門框內緣 */
  /* ⭐️ 調整：將門的窗戶垂直置中 */
  width: 50%;
  height: 100%;
  border-radius: 15px;
  /* ⭐️ 調整：將底色改為與火車車身一致的藍色 */
  background-color: #3b7d96;
  transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 3;
  border: 6px solid #595959; /* ⭐️ 建議：同步將門的邊框也改為深灰色 */
  /* ⭐️ 新增：為門加上外陰影，增加立體感 */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  /* ⭐️ 新增：使用 flexbox 來放置窗戶 */
  display: flex;
  justify-content: center;
  padding-top: 25px; /* 讓窗戶從上方留出一些空間 */
}

.door-window {
  width: 70%; /* 窗戶寬度佔門片的 70% */
  height: 50%; /* 窗戶高度佔門片的 40% */
  background-color: rgba(10, 25, 41, 0.5); /* 與其他窗戶一致的深色半透明背景 */
  border-radius: 15px; /* 窗戶圓角 */
  border: 3px solid #212121; /* ⭐️ 建議：同步將門上窗戶的邊框也改為深灰色 */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4); /* 內陰影增加深度感 */
  /* ⭐️ 新增：設定 z-index 確保窗戶在白色飾條之上 */
  position: relative;
  z-index: 1;
}

/* ⭐️ 新增：門中間的白色飾條 */
.door-leaf::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 25px;
  background-color: white;
  transform: translateY(130%); /* ⭐️ 修正：使用 -50% 來達成精準的垂直置中 */
  z-index: 0; /* 確保飾條在窗戶後面 */
}

.door-leaf.left {
  left: 0;
  border-right-width: 2px;
}

.door-leaf.right {
  right: 0;
  border-left-width: 2px;
}

.door-frame.is-open .door-leaf.left {
  transform: translateX(-101%);
}

.door-frame.is-open .door-leaf.right {
  transform: translateX(101%);
}

.door-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* ⭐️ 調整：背景圖片由 inline style 提供，這裡設定基本樣式 */
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.door-text {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
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
  /* ⭐️ 新增：窗戶內側陰影，增加立體感 */
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4);
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
  background-color: #ea914e;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* ⭐️ 修改："打開" 狀態的動畫，讓窗格向上移動 */
.advantage-card.is-open .window-pane {
  transform: translateY(-80%);
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
  /* ⭐️ 修改：背景改為主色系，並移除模糊效果 */
  background-color: rgba(59, 125, 150, 0.85); /* 主色系 #3b7d96 的 RGBA */
  padding: 2rem 3rem;
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  position: relative; /* 為了設定 z-index */
  z-index: 2; /* 確保文字容器在疊加層之上 */
}

.animated-text {
  /* 文字樣式 */
  color: white;
  font-size: 3rem; /* 調整字體大小 */
  font-weight: bold;
  /* ⭐️ 修改：使用多層次陰影，結合主色系打造光暈效果，提升質感與可讀性 */
  text-shadow:
    0 2px 5px rgba(0, 0, 0, 0.6), /* 基本的深色陰影，增加立體感 */
    0 0 20px rgba(59, 125, 150, 0.8), /* 主色系光暈 */
    0 0 40px rgba(234, 145, 78, 0.4); /* 輔助色點綴 */
  font-family: 'Noto Sans TC', sans-serif; /* 推薦使用思源黑體，或其他適合的字體 */
  white-space: nowrap; /* 確保文字在同一行 */
}

/* 閃爍的游標 */
.cursor {
  display: inline-block;
  width: 3px;
  height: 3.2rem; /* 與字體大小匹配 */
  /* ⭐️ 修改：游標顏色改為輔助色，與光暈呼應 */
  background-color: #ea914e;
  margin-left: 8px;
  animation: blink 1s infinite;
  box-shadow: 0 0 10px #ea914e; /* 讓游標也發光 */
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

/* ⭐️ 新增：Slogan 的樣式 */
.slogan {
  color: rgba(255, 255, 255, 0.9);
  /* ⭐️ 修改：加大字體 */
  font-size: 1.5rem;
  margin-top: 1rem;
  font-weight: bold; /* ⭐️ 修改：將字體加粗 */
  letter-spacing: 1px;
  /* ⭐️ 修改：套用風格一致的陰影 */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7), 0 0 8px rgba(59, 125, 150, 0.5);
  /* 淡入動畫 */
  animation: fadeIn 2s ease-in-out forwards;
  opacity: 0;
  /* 延遲 2.5 秒，等打字動畫快結束時再出現 */
  animation-delay: 2.5s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
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

  /* ⭐️ 新增：Slogan 的響應式樣式 */
  .slogan {
    /* ⭐️ 修改：同步加大字體 */
    font-size: 1.2rem;
  }

  /* ⭐️ 修正：關於區塊的響應式樣式 */
  .about-section {
    padding-bottom: 95px; /* 同步加大手機版的底部 padding (55px 火車 + 40px 空間) */
  }
  .section-title-about {
    font-size: 2rem;
  }
  .about-subtitle {
    font-size: 1.5rem;
  }
  .about-text {
    font-size: 1rem;
  }
  .about-content-wrapper {
    padding: 25px 20px;
  }

  .driving-train {
    height: 55px; /* 在小螢幕上進一步縮小火車 */
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
