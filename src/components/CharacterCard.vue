<!-- Carte utilisé pour répresenter les données (personnages, lieux, episodes)-->
<template>
  <v-card hover :to ="`/personnage/${character.id}`">
    <v-img
      :alt="character.name"
      cover
      height="200"
      :src="getImageUrl(character.image)"
    />
    <v-card-title>{{ character.name }}</v-card-title>
    <v-card-subtitle>Origine : {{ character.origin || "Inconnue" }}</v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { getImageUrl } from '@/utils/imageUrl.js'

  // defini les données qui seront envoyés à cards par l'api
  defineProps({
    character: {
      type: Object,
      required: true,
    },
  })

</script>
