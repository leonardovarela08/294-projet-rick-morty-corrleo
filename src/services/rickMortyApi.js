/**
 * services/rickMortyApi.js
 *
 * Service API : TOUTES les requêtes vers l'API Rick and Morty sont regroupées ici.
 * Le store et les pages appellent ces fonctions au lieu d'utiliser axios directement.
 * Avantage : si l'API change (adresse, format de réponse), on ne modifie que ce fichier.
 */
import api from '@/plugins/axios'

// L'API renvoie au maximum 100 éléments par requête
const PAGE_SIZE = 100

// Charge TOUTES les pages d'une ressource ('characters' ou 'episodes')
// et renvoie un seul tableau avec tous les éléments.
async function fetchAllPages (resource) {
  // 1. Première page : elle indique aussi le nombre total de pages
  const first = await api.get(`/${resource}`, { params: { limit: PAGE_SIZE, page: 1 } })
  const { pages } = first.data.pagination
  let items = first.data.data

  // 2. On prépare les requêtes des pages 2 à `pages`
  const requests = []
  for (let page = 2; page <= pages; page++) {
    requests.push(api.get(`/${resource}`, { params: { limit: PAGE_SIZE, page } }))
  }

  // 3. On les lance toutes en même temps (en parallèle) et on attend les résultats
  const responses = await Promise.all(requests)

  // 4. On ajoute chaque page au tableau
  // (1er « data » = réponse Axios, 2e « data » = enveloppe { data, pagination } de l'API)
  for (const response of responses) {
    items = items.concat(response.data.data)
  }
  return items
}

// Tous les personnages (826, sur 9 pages)
export function fetchAllCharacters () {
  return fetchAllPages('characters')
}

// Tous les épisodes
export function fetchAllEpisodes () {
  return fetchAllPages('episodes')
}

// Un seul personnage par son id.
// Un seul « .data » : pour un personnage seul, l'API ne met pas d'enveloppe.
// Axios lève une erreur si le personnage n'existe pas (404) : c'est l'appelant qui la gère.
export async function fetchCharacterById (id) {
  const response = await api.get(`/characters/${id}`)
  return response.data
}
