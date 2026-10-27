<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Personnages
    </h1>

    <v-row>
      <v-col
        v-for="character in characters"
        :key="character.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <character-card :character="character" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'

  const characters = ref([])

  onMounted(async () => {
    const response = await fetch('https://apis.divtec.me/api/rickandmorty/characters?limit=100')
    const json = await response.json()
    characters.value = json.data
  })
</script>
