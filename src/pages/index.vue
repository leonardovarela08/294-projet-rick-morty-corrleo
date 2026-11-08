<!--
  pages/index.vue — page « Personnages » (accueil)
  Liste paginée des 826 personnages avec recherche, filtre par statut et tri.
  Toute la logique de filtrage est un « pipeline » de computed (voir le script).
-->
<template>
  <v-container>
    <!-- Titre + nombre de résultats après recherche et filtre (masqué pendant le chargement,
         sinon on lirait « (0) » alors que les personnages arrivent) -->
    <h1 class="page-title">
      Personnages
      <span v-if="!isLoading" class="page-title__count">({{ sortedCharacters.length }})</span>
    </h1>

    <!-- ============ Barre de contrôles : recherche, filtre, tri, réinitialisation ============ -->
    <!-- justify="center" : les contrôles restent centrés sous le titre -->
    <v-row class="mb-6" justify="center">
      <!-- Recherche par nom (v-model relié au store grâce à storeToRefs) -->
      <v-col cols="12" md="4" sm="6">
        <v-text-field
          v-model="searchQuery"
          bg-color="surface"
          clearable
          color="primary"
          density="comfortable"
          hide-details
          label="Rechercher un personnage"
          prepend-inner-icon="mdi-magnify"
          rounded="lg"
          variant="outlined"
        />
      </v-col>

      <!-- Filtre par statut -->
      <v-col cols="12" md="3" sm="6">
        <v-select
          v-model="selectedStatus"
          bg-color="surface"
          clearable
          color="primary"
          density="comfortable"
          hide-details
          :items="statusOptions"
          label="Filtrer par statut"
          prepend-inner-icon="mdi-filter-variant"
          rounded="lg"
          variant="outlined"
        />
      </v-col>

      <!-- Tri A → Z / Z → A et réinitialisation (ga-2 : espace de 8px entre les boutons) -->
      <v-col class="d-flex align-center ga-2" cols="12" md="auto">
        <v-btn
          class="mono-button"
          height="48"
          :prepend-icon="sortOrder === 'asc'
            ? 'mdi-sort-alphabetical-ascending'
            : 'mdi-sort-alphabetical-descending'"
          rounded="lg"
          variant="outlined"
          @click="toggleSort"
        >
          Tri {{ sortOrder === 'asc' ? 'A → Z' : 'Z → A' }}
        </v-btn>

        <v-btn
          class="mono-button"
          color="primary"
          height="48"
          prepend-icon="mdi-filter-remove"
          rounded="lg"
          variant="text"
          @click="store.resetFilters()"
        >
          Réinitialiser
        </v-btn>
      </v-col>
    </v-row>

    <!-- ============ Les 3 états de l'API : chargement, erreur, données ============ -->

    <!-- 1. Chargement : des squelettes de la même taille que les cartes -->
    <v-row v-if="isLoading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        lg="4"
        sm="6"
      >
        <!-- overflow-hidden : l'image du squelette respecte les coins arrondis -->
        <v-skeleton-loader class="pass-frame rounded-xl overflow-hidden" type="image, article, actions" />
      </v-col>
    </v-row>

    <!-- 2. Erreur -->
    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <!-- 3. Données -->
    <template v-else>
      <!-- Aucun résultat pour cette recherche / ce filtre -->
      <v-alert
        v-if="sortedCharacters.length === 0"
        type="info"
        variant="tonal"
      >
        Aucun personnage ne correspond à votre recherche ou à ce filtre.
      </v-alert>

      <!-- Grille : 1 carte par ligne sur téléphone, 2 sur tablette, 3 sur grand écran -->
      <v-row v-else>
        <v-col
          v-for="character in paginatedCharacters"
          :key="character.id"
          cols="12"
          lg="4"
          sm="6"
        >
          <character-card :character="character" />
        </v-col>
      </v-row>

      <!-- Pagination : 100 personnages par page, masquée s'il n'y a qu'une page -->
      <v-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        active-color="primary"
        class="mt-8"
        :length="totalPages"
        rounded="circle"
        :total-visible="5"
        variant="outlined"
      />
    </template>
  </v-container>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  // ===== Store =====
  // storeToRefs garde la réactivité : searchQuery, selectedStatus… restent liés au store
  const store = useRickMortyStore()
  const { characters, isLoading, error, currentPage, searchQuery, selectedStatus, sortOrder } = storeToRefs(store)

  // ===== Constantes de la page =====
  const perPage = 100
  // Options du filtre : title = texte affiché, value = valeur envoyée par l'API
  const statusOptions = [
    { title: 'Vivant', value: 'Alive' },
    { title: 'Mort', value: 'Dead' },
    { title: 'Inconnu', value: 'unknown' },
  ]

  // ======================================== Pipeline des personnages ======================================== //
  //  characters → statut → recherche → tri → page. Chaque étape part du résultat de la précédente

  // Filtre les personnages selon leur statut (Vivant, Mort, Inconnu)
  // Un personnage sans statut est traité comme 'unknown' pour pouvoir le filtrer
  const filteredByStatus = computed(() => {
    if (!selectedStatus.value) {
      return characters.value
    }
    return characters.value.filter(c => (c.status || 'unknown') === selectedStatus.value)
  })

  // Recherche par nom, insensible à la casse (toLowerCase des deux côtés)
  const filteredBySearch = computed(() => {
    if (!searchQuery.value) {
      return filteredByStatus.value
    }
    return filteredByStatus.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // Bascule l'ordre du tri entre A → Z et Z → A
  function toggleSort () {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  // Tri alphabétique : copie [...] avant sort() car sort modifie le tableau d'origine
  // localeCompare 'fr' respecte les accents
  const sortedCharacters = computed(() => {
    // La règle du linter propose toSorted() (même résultat) ; on garde la version du cours,
    // qui est sans risque ici puisque [...] crée déjà une copie.
    // eslint-disable-next-line unicorn/no-array-sort
    return [...filteredBySearch.value].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'fr')
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  // Nombre de pages : arrondi au supérieur, et au moins 1
  const totalPages = computed(() => Math.max(1, Math.ceil(sortedCharacters.value.length / perPage)))

  // Retourne une copie de 100 personnages au plus : ceux de la page courante
  // (page 1 : indices 0 à 99, page 2 : 100 à 199… la fin de slice est exclue)
  const paginatedCharacters = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return sortedCharacters.value.slice(start, start + perPage)
  })

  // ===== Watchers =====
  // Si la recherche, le filtre ou le tri change, on revient page 1 (sinon la page courante peut être vide)
  watch([searchQuery, selectedStatus, sortOrder], () => {
    currentPage.value = 1
  })

  // À chaque changement de page, on remonte en haut de la liste
  watch(currentPage, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
</script>

<style scoped>
/* Boutons Tri / Réinitialiser dans la police « mono » de la maquette */
.mono-button {
  font-family: var(--rm-font-mono);
  font-weight: 700;
  letter-spacing: 0.06em;
}
</style>
