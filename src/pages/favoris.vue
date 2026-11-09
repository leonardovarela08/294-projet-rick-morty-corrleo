<!--
  pages/favoris.vue — page « Mes favoris »
  Réutilise la même carte que la page Personnages (CharacterCard).
  Le bouton « Vider mes favoris » demande une confirmation (v-dialog) avant de tout supprimer.
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

    <template v-else>
      <!-- Bouton qui OUVRE la confirmation (il ne supprime rien lui-même) -->
      <div class="d-flex justify-end mb-6">
        <v-btn
          color="error"
          prepend-icon="mdi-delete-sweep"
          rounded="lg"
          variant="outlined"
          @click="showConfirm = true"
        >
          Vider mes favoris
        </v-btn>
      </div>

      <!-- La grille des favoris (getFavorites transforme les id en personnages),
           mêmes colonnes que la page Personnages -->
      <v-row>
        <v-col
          v-for="character in store.getFavorites"
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
    </template>

    <!--
      Boîte de dialogue de confirmation.
      v-model="showConfirm" : elle s'ouvre quand showConfirm vaut true
      et se ferme toute seule (et remet showConfirm à false) si on clique à côté ou sur Échap.
    -->
    <v-dialog v-model="showConfirm" max-width="440">
      <v-card class="pass-frame" rounded="xl" title="Vider tes favoris ?">
        <v-card-text>
          {{ confirmMessage }} Cette action est définitive.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- Annuler : on ferme simplement la boîte, rien n'est supprimé -->
          <v-btn variant="text" @click="showConfirm = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="confirmClear">Vider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation que l'action a bien été faite -->
    <v-snackbar v-model="showSnackbar" color="primary" :timeout="2000">
      Tes favoris ont été vidés
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()

  // ===== État local de la page =====
  // Boîte de confirmation ouverte ou non
  const showConfirm = ref(false)
  // Message « favoris vidés »
  const showSnackbar = ref(false)

  // Texte de la confirmation, au singulier ou au pluriel
  const confirmMessage = computed(() => {
    const count = store.totalFavorites
    return count > 1
      ? `Les ${count} personnages seront retirés de tes favoris.`
      : 'Ce personnage sera retiré de tes favoris.'
  })

  // Appelée seulement quand l'utilisateur a confirmé dans la boîte de dialogue
  function confirmClear () {
    store.clearFavorites()
    showConfirm.value = false
    showSnackbar.value = true
  }
</script>
