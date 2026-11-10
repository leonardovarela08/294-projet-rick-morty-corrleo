<!--
  pages/index.vue — page "voygeurs"
  Liste paginée des 826 personnages avec recherche, filtre par statut et tri.
  Toute la logique de filtrage est un « pipeline » de computed .
-->
<template>
  <v-container>
    <!-- Titre + nombre de résultats après recherche et filtre (masqué pendant le chargement,
         sinon on lirait « (0) » alors que les personnages arrivent) -->
    <h1 class="page-title">
      Voyageurs
      <span v-if="!isLoading" class="page-title__count">({{ sortedCharacters.length }})</span>
    </h1>

    <!-- ============ Barre de contrôles : recherche, filtre, tri, réinitialisation ============ -->
    <!-- 4 colonnes de même largeur sur grand écran (md="3" × 4 = 12), 2 par ligne sur tablette -->
    <v-row class="mb-6">
      <!-- Recherche par nom : composant SearchBar (prop + emit), relié au store par v-model -->
      <v-col cols="12" md="3" sm="6">
        <search-bar v-model="searchQuery" label="Rechercher un personnage" />
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

      <!-- Tri : par numéro ou par ordre alphabétique -->
      <!-- Pas de « clearable » : il y a toujours un tri actif -->
      <v-col cols="12" md="3" sm="6">
        <v-select
          v-model="sortOrder"
          bg-color="surface"
          color="primary"
          density="comfortable"
          hide-details
          :items="sortOptions"
          label="Trier par"
          prepend-inner-icon="mdi-sort"
          rounded="lg"
          variant="outlined"
        />
      </v-col>

      <!-- Réinitialisation de la recherche, du filtre et du tri -->
      <v-col class="d-flex align-center" cols="12" md="3" sm="6">
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

    <!-- 1. Chargement : on affiche des squelettes de la même taille que les cartes -->
    <v-row v-if="isLoading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        lg="4"
        sm="6"
        xl="3"
        xxl="2"
      >
        <!-- overflow-hidden : l'image du squelette respecte les coins arrondis -->
        <v-skeleton-loader class="pass-frame rounded-xl overflow-hidden" type="image, article, actions" />
      </v-col>
    </v-row>

    <!-- 2. Erreur réseau : une alerte à la place de la liste -->
    <v-alert
      v-else-if="error"
      title="Erreur réseau"
      type="error"
      variant="tonal"
    >
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

      <!--
        Grille (une ligne = 12 unités) : 1 carte par ligne sur téléphone (cols="12"),
        2 sur tablette (sm="6"), 3 sur ordinateur (lg="4"), 4 dès 1920 px (xl="3")
        et 6 dès 2560 px (xxl="2"). Sur grand écran, on ajoute des cartes au lieu de les élargir.
      -->
      <v-row v-else>
        <v-col
          v-for="character in paginatedCharacters"
          :key="character.id"
          cols="12"
          lg="4"
          sm="6"
          xl="3"
          xxl="2"
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
  import SearchBar from '@/components/SearchBar.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  // ===== Store =====
  // storeToRefs garde la réactivité : searchQuery, selectedStatus… restent liés au store
  const store = useRickMortyStore()
  const {
    characters, isLoading, error,
    currentPage, searchQuery, selectedStatus, sortOrder,
  } = storeToRefs(store)

  // ===== Constantes de la page =====
  const perPage = 100
  // Options du filtre : title = texte affiché, value = valeur envoyée par l'API
  const statusOptions = [
    { title: 'Vivant', value: 'Alive' },
    { title: 'Mort', value: 'Dead' },
    { title: 'Inconnu', value: 'unknown' },
  ]
  // Options du tri : 'id' = ordre des numéros (Rick n° 1 etc.), comme l'API
  const sortOptions = [
    { title: 'N° (ordre de l’API)', value: 'id' },
    { title: 'Nom A → Z', value: 'asc' },
    { title: 'Nom Z → A', value: 'desc' },
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

  // Recherche par nom, toLowerCase des deux côtés pour rendre la recherche insensible à la caisse
  const filteredBySearch = computed(() => {
    if (!searchQuery.value) {
      return filteredByStatus.value
    }
    return filteredByStatus.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // Tri selon le mode choisi : copie [...] avant sort() car sort modifie le tableau d'origine.
  // La fonction de comparaison renvoie un nombre négatif si a doit venir avant b,
  // positif si a doit venir après, 0 si l'ordre ne change pas.
  const sortedCharacters = computed(() => {
    // La règle du linter propose toSorted() (même résultat) ; on garde la version du cours,
    // qui est sans risque ici puisque [...] crée déjà une copie.
    // eslint-disable-next-line unicorn/no-array-sort
    return [...filteredBySearch.value].sort((a, b) => {
      // Par numéro : a.id - b.id est négatif quand a a le plus petit numéro (ex. 1 - 2 = -1)
      if (sortOrder.value === 'id') {
        return a.id - b.id
      }
      // Par nom : localeCompare 'fr' respecte les accents ; « - » inverse l'ordre pour Z → A
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
/* Bouton Réinitialiser dans la police « mono » de la maquette */
.mono-button {
  font-family: var(--rm-font-mono);
  font-weight: 700;
  letter-spacing: 0.06em;
}
</style>
