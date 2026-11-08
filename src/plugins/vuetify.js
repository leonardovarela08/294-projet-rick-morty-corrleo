/**
 * plugins/vuetify.js
 *
 * Configuration de Vuetify : icônes, styles de base et thème de l'application.
 * Documentation : https://vuetifyjs.com/features/theme/
 */

// Composables
import { createVuetify } from 'vuetify'

// Styles (icônes Material Design + styles de base de Vuetify)
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'rickDark',
    themes: {
      // Thème sombre « néon sci-fi », inspiré de la maquette.
      // Chaque couleur déclarée ici devient utilisable partout :
      //  - en prop Vuetify       : <v-btn color="neon-pink">
      //  - en classe utilitaire  : class="bg-primary" ou class="text-muted"
      //  - en variable CSS       : rgb(var(--v-theme-primary))
      // On ne réécrit donc jamais un code couleur à la main dans les composants.
      rickDark: {
        dark: true,
        colors: {
          // Fonds
          'background': '#080a16', // fond de page, presque noir bleuté
          'surface': '#0e1a2b', // fond des cartes, menus, champs
          'on-background': '#eaf3ea', // texte sur le fond de page
          'on-surface': '#eaf3ea', // texte sur les cartes

          // Couleurs principales
          'primary': '#97ce4c', // vert « portail » : boutons, bandeau des cartes, page active
          'secondary': '#ff5fa8', // rose néon
          'success': '#97ce4c',
          'info': '#26d0e6',
          'warning': '#ff9a4d',
          'error': '#ff6b6b',

          // Couleurs décoratives (fond spatial, pastilles du menu)
          'neon-pink': '#ff5fa8',
          'neon-orange': '#ff9a4d',
          'neon-cyan': '#26d0e6',
          'neon-violet': '#7a3df0',

          // Couleurs du statut d'un personnage (voir src/utils/characterLabels.js)
          'status-dead': '#ff8a6b',
          'status-unknown': '#b9c4bd',

          // Texte secondaire : étiquettes « Espèce », « Genre »…
          'muted': '#9fb3a4',
        },
      },
    },
  },
})
