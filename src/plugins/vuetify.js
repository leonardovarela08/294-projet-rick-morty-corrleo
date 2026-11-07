/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'rickDark',
    themes: {
      rickDark: {
        dark: true,
        colors: {
          background: '#0b0f14',
          surface: '#141b24',
          primary: '#97ce4c',
          secondary: '#00e5ff',
          error: '#ff5252',
          info: '#00e5ff',
          success: '#97ce4c',
          warning: '#ffb300',
        },
      },
    },
  },
})
