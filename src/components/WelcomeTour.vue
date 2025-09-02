<template>
  <v-dialog
    max-width="550px"
    :model-value="modelValue"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-2">
      <v-card-title class="text-h5 text-primary font-weight-bold">
        歡迎來到 島嶼漫遊！
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          我們是一個專為背包客與店家設計的打工換宿媒合平台。
        </p>
        <p class="mb-2">
          在這裡，你可以：
        </p>
        <ul class="pl-5 mb-4">
          <li>🎒 <strong>背包客：</strong> 打造你的專屬履歷，尋找理想的換宿機會。</li>
          <li>🏠 <strong>店家：</strong> 刊登換宿職缺，找到最合適的小幫手。</li>
        </ul>
        <p>準備好開始你的下一趟旅程了嗎？</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="closeDialog">
          開始探索
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({ modelValue: Boolean })
  const emit = defineEmits(['update:modelValue'])

  const closeDialog = () => emit('update:modelValue', false)
</script>
