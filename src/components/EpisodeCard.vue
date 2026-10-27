<!-- Carte utilisé pour répresenter les données (personnages, lieux, episodes)-->
<template>
  <v-card>
    <v-card-title>{{ episode.name }}</v-card-title>
    <v-card-subtitle>Date de sortie : {{ episode.airDate }}</v-card-subtitle>
    <v-card-text>Numéro d'episode : {{ episode.episode }}</v-card-text>
  </v-card>
</template>

<script setup>
  // defini les données qui seront envoyiés à cards par l'api
  defineProps({
    episode: {
      type: Object,
      required: true,
    },
  })

</script>
