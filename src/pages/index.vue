<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Personnages
    </h1>
    <!-- 1. chargement -->
    <v-row v-if="isLoading">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <!-- 2. erreur -->
    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="character in characters"
        :key="character.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <character-card :character="character" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import CharacterCard from '@/components/CharacterCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const { characters, isLoading, error } = storeToRefs(store)
</script>
