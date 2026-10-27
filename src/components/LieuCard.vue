<!-- Carte utilisé pour répresenter les données (personnages, lieux, episodes)-->
<template>
  <v-card>
    <v-card-title>{{ lieu.name }}</v-card-title>
    <v-card-subtitle>Type : {{ lieu.type }}  </v-card-subtitle>
    <v-card-text>{{ lieu.dimension || "Dimension Inconnue" }} <br> Nombre de résidents : {{ lieu.residentCount }}</v-card-text>
  </v-card>
</template>

<script setup>
// defini les données qui seront envoyiés à cards par l'api
  defineProps({
    lieu: {
      type: Object,
      required: true,
    },
  })

</script>
