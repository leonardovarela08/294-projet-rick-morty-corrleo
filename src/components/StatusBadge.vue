<!--
  StatusBadge.vue
  Badge arrondi qui affiche le statut d'un personnage (Vivant, Mort, Inconnu)
  dans la couleur correspondante du thème. Utilisé sur la carte et sur la fiche.
-->
<template>
  <!-- variant="outlined" : seuls le contour et le texte prennent la couleur -->
  <v-chip
    class="status-badge"
    :color="statusInfo.color"
    size="small"
    variant="outlined"
  >
    <!-- Pastille décorative : aria-hidden pour que les lecteurs d'écran ne lisent que le texte -->
    <span aria-hidden="true" class="status-badge__dot" />
    {{ statusInfo.label }}
  </v-chip>
</template>

<script setup>
  import { computed } from 'vue'
  import { getStatusInfo } from '@/utils/characterLabels.js'

  const props = defineProps({
    // Valeur brute de l'API : 'Alive', 'Dead' ou vide
    status: { type: String, default: '' },
  })

  // Libellé français + couleur, recalculés automatiquement si le statut change
  const statusInfo = computed(() => getStatusInfo(props.status))
</script>

<style scoped>
.status-badge {
  font-family: var(--rm-font-mono);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  /* currentColor = la couleur du texte du badge : la pastille suit le statut */
  background: currentColor;
}
</style>
