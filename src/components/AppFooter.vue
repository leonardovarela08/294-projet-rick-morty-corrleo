<!--
  AppFooter.vue
  Pied de page de l'application (inspiré de la maquette).
  Il contient un SLOT : la page qui utilise le footer peut remplacer le texte des crédits.
  Si elle ne donne rien, le contenu par défaut (année + « Rick and Morty ») s'affiche.
-->
<template>
  <!-- flex-column : contenu puis bande rayée l'un sous l'autre ; pa-0 : on gère les marges nous-mêmes -->
  <v-footer class="app-footer flex-column pa-0" color="background">
    <v-container class="app-footer__inner">
      <!-- Logo + accroche -->
      <div class="app-footer__brand">
        <v-avatar image="@/assets/rick-icon.svg" size="40" />
        <div>
          <p class="app-footer__title">Rickedéx</p>
          <p class="app-footer__tagline">Voyagez entre les dimensions.</p>
        </div>
      </div>

      <!-- Crédits : le slot et son contenu par défaut -->
      <p class="app-footer__credits">
        <slot>
          {{ new Date().getFullYear() }} - Rick and Morty
        </slot>
      </p>
    </v-container>

    <!-- Bande rayée décorative tout en bas -->
    <div aria-hidden="true" class="app-footer__stripes" />
  </v-footer>
</template>

<style scoped>
/* Liseré dégradé en haut du footer (mêmes couleurs que le header, dans l'autre sens) */
.app-footer {
  position: relative;
  /* Vuetify donne « flex: 1 1 auto » au v-footer : il s'étirerait sur les pages courtes
     et laisserait une bande vide sous les rayures. C'est v-main qui doit grandir, pas lui. */
  flex: 0 0 auto;
  margin-top: 64px;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-neon-cyan)),
    rgb(var(--v-theme-neon-orange)) 35%,
    rgb(var(--v-theme-neon-pink)) 65%,
    rgb(var(--v-theme-primary))
  );
}

/* Logo à gauche, crédits à droite ; passent l'un sous l'autre sur téléphone (flex-wrap) */
.app-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 48px;
  padding-top: 32px;
  padding-bottom: 24px;
}

.app-footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-footer__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.app-footer__tagline {
  margin: 0;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-muted));
}

.app-footer__credits {
  margin: 0;
  font-family: var(--rm-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: rgb(var(--v-theme-muted));
}

/* Rayures obliques : un dégradé répété (vert / fond) incliné à -45° */
.app-footer__stripes {
  width: 100%;
  height: 10px;
  background: repeating-linear-gradient(
    -45deg,
    rgb(var(--v-theme-primary)) 0 10px,
    rgb(var(--v-theme-background)) 10px 20px
  );
}
</style>
