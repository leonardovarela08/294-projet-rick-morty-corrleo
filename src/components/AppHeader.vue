<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <!--
      Logo de l'application cliquable
        * class="mr-4 pa-0 cursor-pointer" ajoute une marge à droite, retire le padding, et change le curseur pour indiquer la cliquabilité
        * image définit le chemin vers le logo (rick-icon) de l'application
        * size="64" définit la taille de l'avatar
        * @click redirige vers la page d'accueil
      -->
      <v-avatar
        class="mr-4 pa-0 cursor-pointer"
        image="@/assets/rick-icon.svg"
        size="64"
        @click="goHome()"
      />

      <v-toolbar-title> Rickedéx</v-toolbar-title>
      <v-btn
        v-for="link in menuItems"
        :key="link.title"
        :prepend-icon="link.icon"
        :to="link.path"
      >
        {{ link.title }}
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup>
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const router = useRouter()

  // Clic sur le logo : on remet la liste à la page 1, on va à l'accueil et on remonte en haut
  function goHome () {
    store.resetPage()
    router.push('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const menuItems = [
    { title: 'Personnages', path: '/', icon: 'mdi-alien' },
    { title: 'Épisodes', path: '/episodes', icon: 'mdi-ufo' },
    { title: 'Lieux', path: '/lieux', icon: 'mdi-earth' },
    { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
    { title: 'À propos', path: '/a-propos', icon: 'mdi-information' },

  ]
</script>
