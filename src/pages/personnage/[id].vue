
<template>
  <v-container>
    <!-- bouton Retour : @click appelle $router.back() -->
    <v-btn @click=" $router.back()">Retour</v-btn>

    <!-- si pas de personnage on affiche une alerte d'erreur -->
    <v-alert v-if="!character" type="error">Personnage non trouvé.</v-alert>

    <!-- sinon on affiche la carte -->
    <v-card v-else class="mx-auto" max-width="800">
      <v-img
        :alt="character.name"
        cover
        height="300"
        :src="getImageUrl(character.image)"
      />
      <!--Titre de la page detaillée -->
      <v-card-title>{{ character.name }}</v-card-title>
      <!--      affiche tout les informations disponibles sur les personnages-->
      <v-card-text>
        Statut : {{ character.status || "Inconnue"}} <br>
        Espèce : {{ character.species }} <br>
        Genre : {{ character.gender || "Non determiné" }} <br>
        Origine : {{ character.origin || "Inconnue" }} <br>
        Habitat/logement : {{ character.location }} <br>
        Apparaît dans : {{ character.episodeCount }} épisodes

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>

  import { getImageUrl} from '@/utils/imageUrl.js'

  const route = useRoute()
  const character = ref(null)

  onMounted(async () => {
    const response = await fetch(`https://apis.divtec.me/api/rickandmorty/characters/${route.params.id}`)
    if (response.ok) {
      character.value = await response.json()
    }
  })
</script>
<style scoped>

</style>
