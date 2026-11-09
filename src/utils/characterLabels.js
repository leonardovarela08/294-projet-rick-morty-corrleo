/**
 * utils/characterLabels.js
 *
 * Traduction et couleur du statut d'un personnage.
 * L'API renvoie 'Alive', 'Dead', ou rien du tout quand le statut est inconnu.
 * Les couleurs sont des noms de couleurs du thème (src/plugins/vuetify.js).
 */
const STATUS_INFO = {
  Alive: { label: 'Vivant', color: 'primary' },
  Dead: { label: 'Mort', color: 'status-dead' },
  unknown: { label: 'Inconnu', color: 'status-unknown' },
}

// Retourne { label, color } pour un statut donné.
// Tout statut absent ou non prévu est traité comme « Inconnu ».
export function getStatusInfo (status) {
  return STATUS_INFO[status] || STATUS_INFO.unknown
}
