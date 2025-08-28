<template>
  <v-card class="job-list-card" rounded="lg" @click="viewProfile">
    <v-img
      cover
      height="250px"
      :src="backpacker.photos?.[0] || 'https://cdn.vuetifyjs.com/images/john.jpg'"
    />

    <v-card-title class="font-weight-bold text-primary">{{ backpacker.name }}</v-card-title>

    <v-card-text>
      <div class="mb-2">
        <v-icon class="mr-1" small>mdi-map-marker-outline</v-icon>
        <span class="text-subtitle-2">期望地點</span>
      </div>
      <v-chip
        v-for="loc in backpacker.desiredLocations"
        :key="loc"
        class="mr-2 mb-2"
        color="primary"
        size="small"
        variant="tonal"
      >
        {{ loc }}
      </v-chip>
      <p v-if="!backpacker.desiredLocations || backpacker.desiredLocations.length === 0" class="text-grey">
        未指定
      </p>
    </v-card-text>

    <v-divider class="mx-4" />

    <v-card-actions>
      <v-spacer />
      <v-btn color="#ea914e" variant="text" @click.stop="viewProfile">
        查看履歷
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const props = defineProps({
    backpacker: {
      type: Object,
      required: true,
    },
  })

  const router = useRouter()

  const viewProfile = () => {
    // 使用 props.backpacker._id (也就是使用者的 ID) 來建立目標網址
    router.push(`/resumes/${props.backpacker._id}`)
  }
</script>

<style scoped>
.job-list-card {
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  cursor: pointer;
}

.job-list-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 24px -4px rgba(234, 145, 78, 0.3);
}
</style>
