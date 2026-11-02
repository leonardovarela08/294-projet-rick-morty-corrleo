import { defineStore } from 'pinia'
import api from '@/plugins/axios'

// Charge une ressource ('characters', 'episodes' ou 'locations')
async function fetchResource (name) {
  const response = await api.get(`/${name}`, { params: { limit: 100 } })
  return response.data.data
}

// Store pinia
export const useRickMortyStore = defineStore('rickMorty', {
  state: () => ({
    characters: [],
    episodes: [],
    locations: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    totalEpisodes: state => state.episodes.length,
    totalLocations: state => state.locations.length,
  },

  actions: {
    async fetchCharacters () {
      this.characters = await fetchResource(`characters`)
    },
    async fetchEpisodes () {
      this.episodes = await fetchResource(`episodes`)
    },
    async fetchLocations () {
      this.locations = await fetchResource(`locations`)
    },
    async init () {
      this.isLoading = true
      try {
        await Promise.all([
          this.fetchCharacters(),
          this.fetchLocations(),
          this.fetchEpisodes(),
        ])
      } catch (error) {
        this.error = 'Erreur lors du chargement de la page'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
