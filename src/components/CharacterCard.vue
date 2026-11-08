<!--
  CharacterCard.vue
  Carte « Pass interdimensionnel » d'un personnage (inspirée de la maquette).
  Toute la carte est un lien vers la fiche du personnage (:to).
  Réutilisée sur la page Personnages et sur la page Favoris.

  Elle est composée de petits composants réutilisables :
    PassBand       → bandeau vert avec le numéro et le cœur
    PassPhoto      → photo avec les coins de visée
    StatusBadge    → statut coloré (Vivant / Mort / Inconnu)
    InfoField      → une information (étiquette + valeur)
    EpisodeSamples → nombre d'apparitions + exemples d'épisodes
-->
<template>
  <!--
    class="pass-frame" : bordure verte et halo (src/styles/global.scss)
    rounded="xl"       : coins très arrondis
    variant="flat"     : pas d'ombre Vuetify, on utilise notre halo à la place
  -->
  <v-card
    class="pass-card pass-frame"
    rounded="xl"
    :to="`/personnage/${character.id}`"
    variant="flat"
  >
    <!-- 1. Bandeau : titre, numéro et bouton favori -->
    <pass-band :character="character" />

    <!-- 2. Identité : photo à gauche, nom et statut à droite -->
    <div class="pass-card__identity">
      <pass-photo :alt="character.name" :src="getImageUrl(character.image)" />

      <div class="pass-card__title">
        <h2 class="pass-card__name">{{ character.name }}</h2>
        <status-badge :status="character.status" />
      </div>
    </div>

    <!-- 3. Informations sur 2 colonnes -->
    <div class="pass-card__infos">
      <info-field label="Espèce" :value="character.species" />
      <info-field label="Genre" :value="character.gender" />
      <info-field fallback="Inconnue" label="Origine" :value="character.origin" />
      <info-field fallback="Inconnue" label="Dernière position" :value="character.location" />
    </div>

    <!-- 4. Apparitions : nombre réel + 2 épisodes listés + « + N autres épisodes » -->
    <episode-samples :character="character" class="pass-card__episodes" :count="2" />

    <!-- 5. Pied de carte : code-barres décoratif + indication « Voir la fiche » -->
    <div class="pass-card__footer">
      <div aria-hidden="true" class="pass-barcode pass-card__barcode" />
      <!--
        Simple indication visuelle, PAS un vrai bouton : la carte entière est déjà un lien.
        (Mettre un bouton dans un lien n'est pas du HTML valide.)
      -->
      <span aria-hidden="true" class="pass-card__cta bg-primary">Voir la fiche</span>
    </div>
  </v-card>
</template>

<script setup>
  import EpisodeSamples from '@/components/EpisodeSamples.vue'
  import InfoField from '@/components/InfoField.vue'
  import PassBand from '@/components/PassBand.vue'
  import PassPhoto from '@/components/PassPhoto.vue'
  import StatusBadge from '@/components/StatusBadge.vue'
  import { getImageUrl } from '@/utils/imageUrl.js'

  defineProps({
    // Le personnage à afficher (un objet venant de l'API, via le store)
    character: { type: Object, required: true },
  })
</script>

<style scoped>
/*
  La carte est une colonne flex qui prend toute la hauteur de sa colonne de grille :
  toutes les cartes d'une même ligne ont ainsi la même hauteur,
  et le pied (margin-top: auto) reste collé en bas.
*/
.pass-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Au survol (ou focus au clavier) : la carte se soulève et le halo s'intensifie */
.pass-card:hover,
.pass-card:focus-visible {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 4px rgba(var(--v-theme-primary), 0.14),
    0 0 56px -6px rgba(var(--v-theme-primary), 0.6);
}

/* Respecte le réglage « réduire les animations » du système */
@media (prefers-reduced-motion: reduce) {
  .pass-card {
    transition: none;
  }

  .pass-card:hover,
  .pass-card:focus-visible {
    transform: none;
  }
}

.pass-card__identity {
  display: flex;
  gap: 16px;
  padding: 20px 20px 0;
}

/* Nom en haut, badge de statut en bas, à côté de la photo */
.pass-card__title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 2px 0;
}

.pass-card__name {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

/* Grille de 2 colonnes de même largeur */
.pass-card__infos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 14px;
  padding: 22px 20px 0;
}

.pass-card__episodes {
  padding: 18px 20px 16px;
}

.pass-card__footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding: 16px 20px 20px;
  border-top: 1px dashed rgba(var(--v-theme-primary), 0.4);
}

/* Le code-barres prend toute la place restante à gauche */
.pass-card__barcode {
  flex: 1;
}

.pass-card__cta {
  display: flex;
  flex: none;
  align-items: center;
  height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  font-family: var(--rm-font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
