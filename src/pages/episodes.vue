<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Épisodes
    </h1>

    <v-row>
      <v-col
        v-for="episode in episodes"
        :key="episode.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <episode-card :episode="episode" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import EpisodeCard from '@/components/EpisodeCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const { episodes } = storeToRefs(store)
</script>
