<!--
  PassPhoto.vue
  Photo d'un personnage façon « pièce d'identité » : image arrondie
  entourée de 4 coins de visée verts (inspiré de la maquette).
-->
<template>
  <!-- La taille est passée en prop : plus petite sur la carte, plus grande sur la fiche -->
  <div class="pass-photo" :style="{ width: `${width}px`, height: `${height}px` }">
    <v-img
      :alt="alt"
      class="pass-photo__img"
      cover
      :src="src"
    />
    <!-- Les 4 coins de visée : purement décoratifs -->
    <span aria-hidden="true" class="pass-photo__corner pass-photo__corner--top-left" />
    <span aria-hidden="true" class="pass-photo__corner pass-photo__corner--top-right" />
    <span aria-hidden="true" class="pass-photo__corner pass-photo__corner--bottom-left" />
    <span aria-hidden="true" class="pass-photo__corner pass-photo__corner--bottom-right" />
  </div>
</template>

<script setup>
  defineProps({
    // Adresse complète de l'image (calculée par le parent avec getImageUrl)
    src: { type: String, required: true },
    // Texte alternatif : le nom du personnage
    alt: { type: String, required: true },
    // Dimensions en pixels
    width: { type: Number, default: 120 },
    height: { type: Number, default: 150 },
  })
</script>

<style scoped>
.pass-photo {
  position: relative;
  /* flex: none : la photo garde sa taille, c'est le texte à côté qui s'adapte */
  flex: none;
}

.pass-photo__img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  /* Dégradé « portail » visible le temps que l'image se charge */
  background: radial-gradient(circle, #f4ffb0 0, #b7f24f 20%, #34c759 50%, #0f5a3a 100%);
}

/* Un coin = un petit carré dont on n'affiche que 2 bords */
.pass-photo__corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid rgb(var(--v-theme-primary));
}

/* -4px : le coin dépasse légèrement de l'image */
.pass-photo__corner--top-left {
  top: -4px;
  left: -4px;
  border-top-width: 2px;
  border-left-width: 2px;
}

.pass-photo__corner--top-right {
  top: -4px;
  right: -4px;
  border-top-width: 2px;
  border-right-width: 2px;
}

.pass-photo__corner--bottom-left {
  bottom: -4px;
  left: -4px;
  border-bottom-width: 2px;
  border-left-width: 2px;
}

.pass-photo__corner--bottom-right {
  right: -4px;
  bottom: -4px;
  border-right-width: 2px;
  border-bottom-width: 2px;
}
</style>
