<!--
  AppHeader.vue
  En-tête de l'application, en deux parties (inspiré de la maquette) :
    1. une fine barre d'état du « réseau », reliée aux 3 états de l'API du store
    2. la barre principale : logo cliquable + navigation en pastilles
-->
<template>
  <!-- ===== 1. Barre d'état ===== -->
  <!-- v-system-bar : petite barre que Vuetify place tout en haut, au-dessus de v-app-bar -->
  <v-system-bar class="status-bar" color="background" height="28">
    <!-- role="status" : les lecteurs d'écran annoncent le changement (Chargement → Service normal) -->
    <span class="status-bar__item" role="status">
      <span aria-hidden="true" class="status-bar__dot" :class="`bg-${networkStatus.color}`" />
      Réseau interdimensionnel · {{ networkStatus.label }}
    </span>
    <v-spacer />
    <!-- Le nombre de personnages n'est affiché qu'une fois chargé, et pas sur téléphone -->
    <span v-if="!isLoading" class="status-bar__item d-none d-sm-inline">
      {{ characters.length }} voyageurs référencés
    </span>
  </v-system-bar>

  <!-- ===== 2. Barre principale ===== -->
  <v-app-bar class="app-header" flat height="72">
    <v-container class="d-flex align-center ga-4">
      <!--
        Logo cliquable : un vrai <button> (et non une image avec @click)
        pour qu'il soit aussi utilisable au clavier (Tab puis Entrée).
        Il remet la liste à la page 1 et revient à l'accueil.
      -->
      <button
        aria-label="Rickedéx, retour à la première page des personnages"
        class="brand"
        type="button"
        @click="goHome"
      >
        <v-avatar image="@/assets/rick-icon.svg" size="48" />
        <!-- Le texte du logo est masqué sur téléphone pour laisser de la place au menu -->
        <span class="brand__text d-none d-sm-flex">
          <span class="brand__title">Rickedéx</span>
          <span class="brand__subtitle">Réseau interdimensionnel</span>
        </span>
      </button>

      <v-spacer />

      <!-- Navigation : une pastille par page -->
      <nav aria-label="Navigation principale" class="d-flex ga-2">
        <!--
          :exact="true" pour « / » : sinon la pastille Personnages resterait
          active sur toutes les pages.
          aria-label : le texte est masqué sur petit écran, il faut le donner autrement.
        -->
        <v-btn
          v-for="link in menuItems"
          :key="link.path"
          :aria-label="link.title"
          class="nav-link"
          :exact="link.path === '/'"
          height="44"
          rounded="pill"
          :to="link.path"
          variant="text"
        >
          <!-- Rond coloré avec l'icône de la page (bg-… = couleur du thème) -->
          <span aria-hidden="true" class="nav-link__badge" :class="`bg-${link.color}`">
            <v-icon :icon="link.icon" size="16" />
          </span>
          <span class="d-none d-md-inline">{{ link.title }}</span>
        </v-btn>
      </nav>
    </v-container>
  </v-app-bar>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const store = useRickMortyStore()
  const router = useRouter()
  // storeToRefs garde la réactivité : la barre d'état se met à jour toute seule
  const { characters, isLoading, error, isUsingMock } = storeToRefs(store)

  // Les 3 états de l'API traduits en « état du réseau » : texte + couleur du point
  const networkStatus = computed(() => {
    if (isLoading.value) {
      return { label: 'Connexion en cours…', color: 'neon-orange' }
    }
    if (isUsingMock.value) {
      return { label: 'Hors ligne · données de secours', color: 'neon-orange' }
    }
    if (error.value) {
      return { label: 'Perturbation', color: 'status-dead' }
    }
    return { label: 'Service normal', color: 'primary' }
  })

  // Pages du menu : titre, adresse, icône et couleur de la pastille
  const menuItems = [
    { title: 'Voyageurs', path: '/', icon: 'mdi-alien', color: 'primary' },
    { title: 'Favoris', path: '/favoris', icon: 'mdi-heart', color: 'neon-pink' },
    { title: 'À propos', path: '/a-propos', icon: 'mdi-information-variant', color: 'neon-cyan' },
  ]

  // Clic sur le logo : on remet la liste à la page 1, on va à l'accueil et on remonte en haut
  function goHome () {
    store.resetPage()
    router.push('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<style scoped>
/* ----- Barre d'état ----- */
.status-bar {
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.25);
  font-family: var(--rm-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: rgb(var(--v-theme-muted));
}

.status-bar__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-bar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* ----- Barre principale ----- */
/* Fond sombre légèrement transparent + flou : le contenu qui défile dessous reste deviné */
.app-header {
  background: rgba(var(--v-theme-background), 0.88);
  backdrop-filter: blur(8px);
}

/* Liseré dégradé aux 4 couleurs néon, sous la barre */
.app-header::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-neon-pink)) 35%,
    rgb(var(--v-theme-neon-orange)) 65%,
    rgb(var(--v-theme-neon-cyan))
  );
}

/* Le bouton du logo n'a pas l'apparence d'un bouton (pas de fond ni de bordure) */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.brand__text {
  flex-direction: column;
  align-items: flex-start;
}

.brand__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.1;
}

.brand__subtitle {
  font-family: var(--rm-font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-muted));
}

/* Pastilles du menu : texte normal (Vuetify met les boutons en majuscules par défaut) */
.nav-link {
  padding: 0 16px 0 8px;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

/* Page active : Vuetify ajoute la classe v-btn--active → contour et fond verts */
.nav-link.v-btn--active {
  border-color: rgba(var(--v-theme-primary), 0.55);
  background: rgba(var(--v-theme-primary), 0.12);
}

.nav-link__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 50%;
}

/* Sur petit écran, le texte est masqué : on retire la marge à droite de l'icône */
@media (max-width: 959px) {
  .nav-link {
    padding: 0 8px;
  }

  .nav-link__badge {
    margin-right: 0;
  }
}
</style>
