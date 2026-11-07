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
    favorites: [],
  }),

  getters: {
    totalEpisodes: state => state.episodes.length,
    totalLocations: state => state.locations.length,
    totalFavorites: state => state.favorites.length,
    isFavorite: state => character => state.favorites.includes(character.id),
    getFavorites: state =>
      state.favorites
        .map(id => state.characters.find(c => c.id === id))
        .filter(Boolean),
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
        this.loadFavorites()
      } catch (error) {
        this.error = 'Erreur lors du chargement de la page'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    saveFavorites () {
      localStorage.setItem('rickmorty_favorites', JSON.stringify(this.favorites))
    },
    loadFavorites () {
      try {
        const saved = localStorage.getItem('rickmorty_favorites')
        this.favorites = saved ? JSON.parse(saved) : []
      } catch (error) {
        console.error(error)
        this.favorites = []
      }
    },
    toggleFavorite (character) {
      const index = this.favorites.indexOf(character.id)
      if (index === -1) {
        this.favorites.push(character.id)
      } else {
        this.favorites.splice(index, 1)
      }
      this.saveFavorites()
    },
  },
})
