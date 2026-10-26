<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <v-toolbar-title>Rick and Morty</v-toolbar-title>

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
const menuItems = [
  { title: 'Personnages', path: '/', icon: 'mdi-alien' },
  { title: 'Episodes', path: '/episodes', icon: 'mdi-ufo' },
  {title: 'Lieux', path: '/lieux', icon: 'mdi-earth' },
  { title: 'À propos', path: '/a-propos', icon: 'mdi-information' },

]
</script>
