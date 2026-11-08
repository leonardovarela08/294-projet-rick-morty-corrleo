<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Personnages ({{ sortedCharacters.length }})
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
          v-for="character in paginatedCharacters"
          :key="character.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <character-card :character="character" />
        </v-col>
      </v-row>
      <v-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        class="mt-6"
      />
    </template>
  </v-container>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  // déclaration des constantes
  const store = useRickMortyStore()
  const { characters, isLoading, error, currentPage } = storeToRefs(store)

  const perPage = 100
  const searchQuery = ref("")
  const selectedStatus = ref(null)
  const sortOrder = ref('asc')
  const statusOptions = [
    { title: 'Vivant', value: 'Alive' },
    { title: 'Mort', value: 'Dead' },
    { title: 'Inconnu', value: 'unknown' },
  ]

  // ======================================== Pipeline des personnages/ données  ================================================= //

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

  // Fonction pour trier/ ordonner les personnages en ordre alphabétique
  function toggleSort () {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const sortedCharacters = computed(() => {
    return [...filteredBySearch.value].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'fr')
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(sortedCharacters.value.length / perPage)))

  // retourne un copie du tableau avec 100 personnages, permetant d'afficher 100 par page
  const paginatedCharacters = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return sortedCharacters.value.slice(start, start + perPage)
  })

  watch([searchQuery, selectedStatus, sortOrder], () => {
    currentPage.value = 1
  })

  watch(currentPage, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
</script>
