<!-- Carte utilisé pour répresenter les données (personnages, lieux, episodes)-->
<template>
  <v-card hover :to="`/personnage/${character.id}`">
    <v-img
      :alt="character.name"
      cover
      height="200"
      :src="getImageUrl(character.image)"
    />
    <v-card-title>{{ character.name }}</v-card-title>
    <v-card-subtitle>Origine : {{ character.origin || "Inconnue" }}</v-card-subtitle>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        :icon="store.isFavorite(character) ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="store.isFavorite(character) ? 'red' : ''"
        variant="text"
        @click.stop.prevent="handleToggleFavorite"
      />
    </v-card-actions>

    <v-snackbar v-model="showSnackbar" :timeout="2000" color="primary">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'
  import { getImageUrl } from '@/utils/imageUrl.js'

  const props = defineProps({
    character: { type: Object, required: true },
  })

  const store = useRickMortyStore()
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')

  function handleToggleFavorite () {
    const wasFavorite = store.isFavorite(props.character)
    store.toggleFavorite(props.character)
    snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
    showSnackbar.value = true
  }

</script>
