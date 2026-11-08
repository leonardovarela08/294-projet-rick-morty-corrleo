// ================================================ Store =============================================== //
// Store Pinia de l'application : données de l'API, favoris et état de la liste des personnages.
import { defineStore } from 'pinia'
import api from '@/plugins/axios'

// Charge TOUTES les pages d'une ressource ('characters' ou 'episodes').
// L'API limite chaque réponse à 100 éléments : il faut donc demander page après page.
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

  // 3. On les lance toutes en même temps (en parallèle) et on attend les résultats
  const responses = await Promise.all(requests)

  // 4. On ajoute chaque page au tableau
  // (1er « data » = réponse Axios, 2e « data » = enveloppe de l'API)
  for (const response of responses) {
    items = items.concat(response.data.data)
  }
  return items
}

// Store pinia
export const useRickMortyStore = defineStore('rickMorty', {
  state: () => ({
    // --- Données de l'API ---
    characters: [],
    // Les épisodes ne sont plus affichés dans une page à part :
    // ils servent d'exemples sur les cartes et les fiches (voir getSampleEpisodes).
    episodes: [],
    isLoading: false,
    error: null,

    // --- Favoris (tableau d'id, sauvegardé dans le localStorage) ---
    favorites: [],

    // --- État de la liste des personnages ---
    // Gardé dans le store (et pas dans la page) pour survivre à la navigation :
    // on retrouve sa recherche, son filtre, son tri et sa page en revenant d'une fiche.
    searchQuery: '',
    selectedStatus: null,
    sortOrder: 'asc',
    // Page affichée (dans le store aussi pour que le logo du header puisse la remettre à 1)
    currentPage: 1,
  }),

  getters: {
    totalFavorites: state => state.favorites.length,

    // Getter qui retourne une fonction, pour pouvoir lui passer un personnage
    isFavorite: state => character => state.favorites.includes(character.id),

    // Transforme les id favoris en objets personnages.
    // find() renvoie undefined si un id n'existe plus : filter(Boolean) retire ces cas.
    getFavorites: state =>
      state.favorites
        .map(id => state.characters.find(c => c.id === id))
        .filter(Boolean),

    // Épisodes « d'illustration » pour un personnage (accord du prof) :
    // l'API ne relie pas personnages et épisodes, on en choisit donc quelques-uns.
    // Le choix dépend de l'id du personnage, pour que ce soit TOUJOURS les mêmes
    // épisodes pour un même personnage (un Math.random() changerait la liste
    // à chaque affichage, en revenant d'une fiche ou en changeant de page).
    getSampleEpisodes: state => (character, count) => {
      // Pas plus d'épisodes que ceux où il apparaît vraiment, ni que ceux chargés
      const size = Math.min(count, character.episodeCount ?? count, state.episodes.length)
      // Dernier point de départ possible pour qu'il reste « size » épisodes après lui
      const maxStart = state.episodes.length - size
      // « × 7 » écarte les points de départ de deux personnages voisins (id 1, 2, 3…),
      // le modulo (%) garde le résultat entre 0 et maxStart.
      const start = maxStart > 0 ? (character.id * 7) % (maxStart + 1) : 0
      // slice() renvoie une copie : le tableau du store n'est pas modifié
      return state.episodes.slice(start, start + size)
    },
  },

  actions: {
    async fetchCharacters () {
      this.characters = await fetchResource('characters')
    },
    async fetchEpisodes () {
      this.episodes = await fetchResource('episodes')
    },

    // Appelée une seule fois au démarrage (App.vue)
    async init () {
      this.isLoading = true
      // Les favoris viennent du navigateur, pas de l'API : on les charge d'abord,
      // pour ne jamais écraser la sauvegarde si l'API est lente ou en erreur.
      this.loadFavorites()
      try {
        // Personnages et épisodes chargés en parallèle
        await Promise.all([
          this.fetchCharacters(),
          this.fetchEpisodes(),
        ])
      } catch (error) {
        this.error = 'Erreur lors du chargement de la page'
        console.error(error)
      } finally {
        // finally s'exécute toujours (succès ou erreur) : le chargement est terminé
        this.isLoading = false
      }
    },

    // --- Favoris ---
    // localStorage ne stocke que du texte : JSON.stringify transforme le tableau en texte
    saveFavorites () {
      localStorage.setItem('rickmorty_favorites', JSON.stringify(this.favorites))
    },
    // JSON.parse refait le tableau ; try/catch au cas où le texte sauvegardé serait corrompu
    loadFavorites () {
      try {
        const saved = localStorage.getItem('rickmorty_favorites')
        this.favorites = saved ? JSON.parse(saved) : []
      } catch (error) {
        console.error(error)
        this.favorites = []
      }
    },
    // Pattern toggle : indexOf renvoie -1 si l'id est absent → on l'ajoute, sinon on le retire
    toggleFavorite (character) {
      const index = this.favorites.indexOf(character.id)
      if (index === -1) {
        this.favorites.push(character.id)
      } else {
        this.favorites.splice(index, 1)
      }
      this.saveFavorites()
    },

    // --- Liste des personnages ---
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
