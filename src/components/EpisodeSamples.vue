<!--
  EpisodeSamples.vue
  Bloc « Apparitions » d'un personnage :
    - le VRAI nombre d'épisodes où il apparaît (episodeCount, donné par l'API)
    - quelques exemples d'épisodes, choisis par le store (getSampleEpisodes).
  L'API ne relie pas personnages et épisodes : avec l'accord du prof, les exemples
  servent d'illustration, et on l'indique clairement à l'utilisateur.
-->
<template>
  <div class="episode-samples">
    <!-- En-tête : étiquette + nombre réel d'apparitions -->
    <div class="episode-samples__header">
      <span class="mono-label">Apparitions</span>
      <!-- Singulier ou pluriel selon le nombre : « 1 épisode », « 36 épisodes » -->
      <span class="episode-samples__count">
        {{ episodeCount }} {{ episodeCount > 1 ? 'épisodes' : 'épisode' }}
      </span>
    </div>

    <!-- Liste des exemples : une ou deux colonnes selon la prop « columns » -->
    <ul
      v-if="samples.length > 0"
      class="episode-samples__list"
      :class="{ 'episode-samples__list--two-columns': columns === 2 }"
    >
      <li
        v-for="episode in samples"
        :key="episode.id"
        class="episode-samples__item"
      >
        <!-- Code de l'épisode (ex. S01E01) puis son titre -->
        <span class="episode-samples__code">{{ episode.episode }}</span>
        <span>{{ episode.name }}</span>
      </li>
    </ul>

    <!-- Seuls quelques épisodes sont listés : on indique combien il en reste -->
    <p v-if="remaining > 0" class="episode-samples__more">
      + {{ remaining }} {{ remaining > 1 ? 'autres épisodes' : 'autre épisode' }}
    </p>

    <!-- Mention honnête : le nombre est réel, mais les titres sont choisis pour illustrer -->
    <p v-if="samples.length > 0" class="episode-samples__hint">
      Titres d'épisodes donnés à titre d'illustration
    </p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRickMortyStore } from '@/stores/rickMortyStore.js'

  const props = defineProps({
    // Le personnage dont on affiche les apparitions
    character: { type: Object, required: true },
    // Nombre d'épisodes à lister (2 sur la carte, 4 sur la fiche) ; le reste est résumé en « + N autres »
    count: { type: Number, default: 2 },
    // 1 ou 2 colonnes (2 sur la fiche, où il y a de la place)
    columns: { type: Number, default: 1 },
  })

  const store = useRickMortyStore()

  // Toujours les mêmes épisodes pour un même personnage (voir le store)
  const samples = computed(() => store.getSampleEpisodes(props.character, props.count))

  // Vrai nombre d'apparitions donné par l'API (0 s'il manque)
  const episodeCount = computed(() => props.character.episodeCount ?? 0)

  // Nombre d'apparitions qui ne sont pas listées (ex. 36 apparitions - 2 listées = 34)
  // Math.max(0, …) évite un nombre négatif
  const remaining = computed(() => Math.max(0, episodeCount.value - samples.value.length))
</script>

<style scoped>
.episode-samples__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.episode-samples__count {
  font-family: var(--rm-font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

/* Remise à zéro du style par défaut d'une liste (puces, marges) */
.episode-samples__list {
  display: grid;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

/* Sur la fiche : 2 colonnes séparées de 24px */
.episode-samples__list--two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
}

.episode-samples__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(var(--v-theme-primary), 0.25);
  font-size: 0.9rem;
  font-weight: 500;
}

.episode-samples__code {
  flex: none;
  font-family: var(--rm-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.episode-samples__more {
  margin: 8px 0 0;
  font-family: var(--rm-font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.episode-samples__hint {
  margin: 8px 0 0;
  font-size: 0.75rem;
  font-style: italic;
  color: rgb(var(--v-theme-muted));
}

/* Sur un écran étroit (téléphone), on revient à une seule colonne */
@media (max-width: 599px) {
  .episode-samples__list--two-columns {
    grid-template-columns: 1fr;
  }
}
</style>
