<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'
  const store = useRickMortyStore()

  onMounted(async () => {
    await store.init()
  })
</script>
