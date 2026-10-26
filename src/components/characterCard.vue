<template>
  <v-card>
    <v-img
      :src="getImageUrl(character.image)"
      :alt="character.name"
      height="200"
      cover
    />
    <v-card-title>{{ character.name }}</v-card-title>
    <v-card-subtitle>Origine : {{ character.origin || "Inconue" }}</v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { getImageUrl } from '@/utils/imageUrl.js'

  defineProps({
    character: {
      type: object,
      required: true,
    },
  })

</script>

<style scoped lang="sass">

</style>
