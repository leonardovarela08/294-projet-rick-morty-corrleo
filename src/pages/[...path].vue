<!--
  pages/[...path].vue — page 404
  Le nom [...path] attrape toutes les adresses qui ne correspondent à aucune autre page.
-->
<template>
  <!-- text-center : tout le contenu est centré ; py-10 : grand espace en haut et en bas -->
  <v-container class="text-center py-10">
    <!-- Titre de la page 404, même style que les autres titres de page -->
    <h1 class="page-title">Oups ! Page non trouvée <span class="page-title__count">(404)</span></h1>

    <!-- Message qui explique que la page n'existe pas -->
    <p class="text-subtitle-1 mb-6">
      La page que vous cherchez n'existe pas ou a été déplacée dans une autre dimension.
    </p>

    <!-- Bouton de retour à l'accueil : to="/" fait la navigation -->
    <v-btn
      color="primary"
      prepend-icon="mdi-home"
      rounded="lg"
      size="large"
      to="/"
    >
      Retour à l'accueil
    </v-btn>
  </v-container>
</template>
