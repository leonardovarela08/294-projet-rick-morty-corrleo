<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Lieux
    </h1>
    <v-row v-if="isLoading">
      <v-col v-for="n in 8"
             :key="n"
             cols="12"
             lg="3"
             md="4"
             sm="6">
        <v-skeleton-loader type="article" />
      </v-col>
    </v-row>

    <!-- 2. erreur -->
    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <v-row v-else>
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
  import LieuCard from '@/components/LieuCard.vue'

  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const { locations, isLoading, error } = storeToRefs(store)
</script>
