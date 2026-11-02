import axios from 'axios'

// Constante pour l'URL de base lue avec import.meta.env depuis le fichier env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://apis.divtec.me/api/rickandmorty'

// crée une instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

})

// on est export l'api pour l'utiliser par tout
export default api
