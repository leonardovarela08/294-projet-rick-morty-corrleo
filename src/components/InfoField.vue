<!--
  InfoField.vue
  Une information d'un personnage : une petite étiquette en majuscules
  au-dessus de sa valeur (ex. « ESPÈCE » / « Human »).
  Utilisé plusieurs fois sur la carte et sur la fiche.
-->
<template>
  <div class="info-field">
    <!-- .mono-label est défini dans src/styles/global.scss -->
    <span class="mono-label">{{ label }}</span>
    <!-- Si l'API ne donne pas de valeur, on affiche le texte de secours -->
    <span class="info-field__value">{{ value || fallback }}</span>
  </div>
</template>

<script setup>
  defineProps({
    // Texte de l'étiquette (« Espèce », « Origine »…)
    label: { type: String, required: true },
    // Valeur venant de l'API (peut être vide)
    value: { type: [String, Number], default: '' },
    // Texte affiché quand la valeur est vide
    fallback: { type: String, default: 'Inconnu' },
  })
</script>

<style scoped>
.info-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  /* min-width: 0 autorise la colonne de la grille à rétrécir avec un texte long */
  min-width: 0;
}

.info-field__value {
  font-size: 0.95rem;
  font-weight: 500;
  /* Coupe un mot très long (ex. un nom de planète) au lieu de déborder de la carte */
  overflow-wrap: anywhere;
}
</style>
