<!--
  pages/favoris.vue — page « Mes favoris »
  Réutilise la même carte que la page Personnages (CharacterCard).
-->
<template>
  <v-container>
    <h1 class="page-title">
      Mes favoris <span class="page-title__count">({{ store.totalFavorites }})</span>
    </h1>

    <!-- Aucun favori : message d'aide -->
    <v-alert
      v-if="store.totalFavorites === 0"
      class="mb-6"
      type="info"
      variant="tonal"
    >
      Aucun favori pour le moment. Clique sur le cœur d'un personnage pour l'ajouter.
    </v-alert>

    <!-- Sinon : la grille des favoris (getFavorites transforme les id en personnages) -->
    <v-row v-else>
      <v-col
        v-for="character in store.getFavorites"
        :key="character.id"
        cols="12"
        lg="4"
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
</script>
