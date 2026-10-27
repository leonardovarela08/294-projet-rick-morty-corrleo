<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Lieux
    </h1>

    <v-row>
      <v-col
        v-for="lieu in lieux"
        :key="lieu.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <lieu-card :lieu="lieu" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import LieuCard from '@/components/LieuCard.vue'

  const lieux = ref([])

  onMounted(async () => {
    const response = await fetch('https://apis.divtec.me/api/rickandmorty/locations?limit=100')
    const json = await response.json()
    lieux.value = json.data
  })
</script>
