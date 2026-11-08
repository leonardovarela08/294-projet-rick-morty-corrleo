<!--
  PassBand.vue
   « Pass interdimensionnel » :
  titre, numéro du personnage (son id) et bouton favori avec son message de confirmation.
-->
<template>
  <!-- bg-primary : fond vert du thème ; Vuetify choisit tout seul un texte foncé lisible dessus -->
  <div class="pass-band bg-primary">
    <span>Pass interdimensionnel</span>

    <div class="pass-band__end">
      <span>N° {{ character.id }}</span>

      <!--
        Bouton favori (cœur).
        @click.stop.prevent : sur la liste, toute la carte est un lien vers la fiche.
          .stop    → le clic ne remonte pas jusqu'à la carte (stopPropagation)
          .prevent → bloque la navigation du lien (preventDefault)
        Sans les deux, cliquer sur le cœur ouvrirait la fiche.
        aria-label : le bouton n'a qu'une icône, ce texte est lu par les lecteurs d'écran.
      -->
      <v-btn
        :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        color="background"
        icon
        size="40"
        variant="flat"
        @click.stop.prevent="handleToggleFavorite"
      >
        <v-icon
          :color="isFavorite ? 'neon-pink' : undefined"
          :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        />
      </v-btn>
    </div>

    <!-- Message de confirmation, masqué automatiquement après 2 secondes -->
    <v-snackbar v-model="showSnackbar" color="primary" :timeout="2000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const props = defineProps({
    // Le personnage affiché (on utilise son id)
    character: { type: Object, required: true },
  })

  const store = useRickMortyStore()

  // Le personnage est-il dans les favoris ? (recalculé dès que les favoris changent)
  const isFavorite = computed(() => store.isFavorite(props.character))

  // État du message de confirmation
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')

  // Ajoute ou retire le favori, puis affiche le message adapté
  function handleToggleFavorite () {
    // On mémorise l'état AVANT le changement pour choisir le bon message
    const wasFavorite = isFavorite.value
    store.toggleFavorite(props.character)
    snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
    showSnackbar.value = true
  }
</script>

<style scoped>
.pass-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 8px 4px 20px;
  font-family: var(--rm-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.pass-band__end {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
