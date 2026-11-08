<!--
  pages/a-propos.vue — page « À propos »
  Présentation du projet, dans un cadre « Pass » comme les cartes.
-->
<template>
  <v-container>
    <h1 class="page-title">À propos</h1>

    <!-- max-width + mx-auto : un texte trop large est difficile à lire, on le centre -->
    <v-card
      class="pass-frame mx-auto pa-6 pa-sm-8"
      max-width="760"
      rounded="xl"
      variant="flat"
    >
      <p class="about-text">
        Bienvenue dans mon projet consacré à l’univers déjanté de Rick and Morty ! Tu y découvriras les personnages,
        les aventures et les mondes parallèles qui rendent cette série si originale. Ce projet est né de mon intérêt
        pour son humour, sa science-fiction et ses histoires pleines de surprises. Bonne exploration à travers le
        multivers !
      </p>
    </v-card>
  </v-container>
</template>

<style scoped>
.about-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
}
</style>
