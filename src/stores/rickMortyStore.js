import { defineStore } from 'pinia'

// Charge une ressource ('characters', 'episodes' ou 'locations')
async function fetchResource (name) {
  const response = await fetch(`https://apis.divtec.me/api/rickandmorty/${name}?limit=100`)
  if (!response.ok) {
    throw new Error(`${name} non trouvé`)
  }
  const json = await response.json()
  return json.data
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
