/**
 * main.js
 *
 * Point d'entrée : crée l'application Vue, enregistre les plugins
 * (Vuetify, router, Pinia) puis l'affiche dans <div id="app">.
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
// Styles partagés par toute l'application (fond spatial, cadre « Pass », étiquettes…)
import '@/styles/global.scss'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
