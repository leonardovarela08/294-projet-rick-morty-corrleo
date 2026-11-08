// ================================================ Store =============================================== //
import { defineStore } from 'pinia'
import api from '@/plugins/axios'

// Charge une ressource ('characters', 'episodes' ou 'locations')
// l'api limite chaque réponse à 100 élements
async function fetchResource (name) {
  // 1. Première page : on lit aussi le nombre total de pages
  const first = await api.get(`/${name}`, { params: { limit: 100, page: 1 } })
  const { pages } = first.data.pagination
  let items = first.data.data

  // 2. On prépare les requêtes des pages 2 à `pages`
  const requests = []
  for (let page = 2; page <= pages; page++) {
    requests.push(api.get(`/${name}`, { params: { limit: 100, page } }))
  }

  // 3. On les lance toutes en même temps et on attend les résultats
  const responses = await Promise.all(requests)

  // 4. On ajoute chaque page au tableau
  for (const response of responses) {
    items = items.concat(response.data.data)
  }
  return items
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
    // Page affiché dans la liste des personnages (je l'ai mis dans le store pour que le header puisse le réinitialiser
    currentPage: 1,
    // --- État de la liste des personnages ---
    // Gardé dans le store (et pas dans la page) pour survivre à la navigation :
    // on retrouve sa recherche, son filtre, son tri et sa page en revenant d'une fiche.
    searchQuery: '',
    selectedStatus: null,
    sortOrder: 'asc',
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
      this.loadFavorites()
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
    // Remet la liste des personnages sur sa première page
    resetPage () {
      this.currentPage = 1
    },
    // Remet recherche, filtre, tri et page à leur valeur de départ
    resetFilters () {
      this.searchQuery = ''
      this.selectedStatus = null
      this.sortOrder = 'asc'
      this.currentPage = 1
    },
  },
})
