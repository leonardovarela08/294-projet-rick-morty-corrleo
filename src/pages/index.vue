<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Personnages
    </h1>

    <v-row class="mb-4">
      <!--      Barre de recherches par nom-->
      <v-col
        cols="12"
        md="4"
        sm="6"
      >
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un personnage"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="compact"
        />
      </v-col>

      <!--Barre de filtre par status -->
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          label="Filtrer par status"
          prepend-inner-icon="mdi-filter"
          clearable
          hide-details
          variant="outlined"
          density="compact"
        />
      </v-col>
      <!-- Bouton de tri  -->

      <v-col
        cols="12"
        md="4"
        class="d-flex align-center"
      >
        <v-btn
          variant="outlined"
          :prepend-icon="sortOrder === 'asc'
            ? 'mdi-sort-alphabetical-ascending'
            : 'mdi-sort-alphabetical-descending'"
          @click="toggleSort"
        >
          Tri {{ sortOrder === 'asc' ? 'A → Z' : 'Z → A' }}
        </v-btn>
      </v-col>
    </v-row>
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

    <!--    données -->
    <template v-else>
      <v-alert
        v-if="sortedCharacters.length === 0"
        type="info"
        variant="tonal"
      >
        Aucun personnage ne correspond à votre recherche ou à ce filtre.
      </v-alert>
      <v-row v-else>
        <v-col
          v-for="character in sortedCharacters"
          :key="character.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <character-card :character="character" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  // déclaration des constantes
  const store = useRickMortyStore()
  const { characters, isLoading, error } = storeToRefs(store)

  const searchQuery = ref("")
  const selectedStatus = ref(null)
  const sortOrder = ref('asc')
  const statusOptions = [
    { title: 'Vivant', value: 'Alive' },
    { title: 'Mort', value: 'Dead' },
    { title: 'Inconnu', value: 'unknown' },
  ]

  // Filtre les personnages selon leurs status (Vivant, Mort, Inconnu)
  const filteredByStatus = computed(() => {
    if (!selectedStatus.value) {
      return characters.value
    }
    return characters.value.filter(c => (c.status || 'unknown') === selectedStatus.value)
  })

  // Permets à l'utilisateur de chercher un personnage
  const filteredBySearch = computed(() => {
    if (!searchQuery.value) {
      return filteredByStatus.value
    }

    return filteredByStatus.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // Fonction pour trier/ ordonner le personnages en ordre alphabétique
  function toggleSort() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const sortedCharacters = computed(() => {
    return [...filteredBySearch.value].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'fr')
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })
</script>
