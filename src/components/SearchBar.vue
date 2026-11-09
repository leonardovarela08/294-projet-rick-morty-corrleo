<!--
  SearchBar.vue
  Champ de recherche réutilisable, utilisable avec v-model :
    <search-bar v-model="searchQuery" label="Rechercher un personnage" />

  Comment fonctionne v-model sur un composant ?
  Vue le traduit en deux choses :
    1. une prop   :model-value="searchQuery"               → le parent ENVOIE la valeur
    2. un event   @update:model-value="searchQuery = $event" → l'enfant RENVOIE la nouvelle valeur
  Le composant ne modifie jamais sa prop lui-même (une prop est en lecture seule) :
  il prévient le parent avec emit, et c'est le parent qui met à jour sa donnée.
-->
<template>
  <!--
    :model-value      : affiche la valeur reçue du parent
    @update:model-value : appelée à chaque frappe (ou au clic sur la croix « clearable »)
  -->
  <v-text-field
    bg-color="surface"
    clearable
    color="primary"
    density="comfortable"
    hide-details
    :label="label"
    :model-value="modelValue"
    prepend-inner-icon="mdi-magnify"
    rounded="lg"
    variant="outlined"
    @update:model-value="handleInput"
  />
</template>

<script setup>
  defineProps({
    // Valeur actuelle de la recherche (fournie par v-model du parent)
    modelValue: { type: String, default: '' },
    // Texte affiché dans le champ
    label: { type: String, default: 'Rechercher' },
  })

  // Liste des événements que ce composant peut envoyer à son parent
  const emit = defineEmits(['update:modelValue'])

  // La croix « clearable » renvoie null : on le transforme en texte vide
  // pour que le parent reçoive toujours une chaîne de caractères.
  function handleInput (value) {
    emit('update:modelValue', value ?? '')
  }
</script>
