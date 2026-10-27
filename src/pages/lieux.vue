<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Lieux
    </h1>

    <v-row>
      <v-col
        v-for="lieu in locations"
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

  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const { locations } = storeToRefs(store)
</script>
