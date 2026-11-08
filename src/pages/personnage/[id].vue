<!--
  pages/personnage/[id].vue — fiche détaillée d'un personnage
  [id] dans le nom du fichier = route dynamique : /personnage/42 → route.params.id vaut '42'.
  La fiche fait sa propre requête par id (l'API renvoie directement le personnage).
-->
<template>
  <v-container>
    <!--
      Bouton retour : $router.back() revient à la page précédente.
      Comme la recherche, le filtre et la page sont dans le store,
      on retrouve la liste exactement comme on l'avait laissée.
    -->
    <!-- La div a la même largeur que la fiche : le bouton reste aligné sur son bord gauche -->
    <div class="detail-back">
      <v-btn
        color="primary"
        prepend-icon="mdi-chevron-left"
        variant="text"
        @click="$router.back()"
      >
        Retour aux personnages
      </v-btn>
    </div>

    <!-- 1. Chargement : isLoading vaut true dès le départ (pas de flash d'erreur) -->
    <v-skeleton-loader
      v-if="isLoading"
      class="detail-card pass-frame rounded-xl overflow-hidden"
      type="heading, image, article"
    />

    <!-- 2. Personnage introuvable (id inexistant ou erreur de l'API) -->
    <v-alert
      v-else-if="!character"
      class="detail-card"
      type="error"
      variant="tonal"
    >
      Personnage non trouvé.
    </v-alert>

    <!-- 3. La fiche : un grand « Pass » sur deux colonnes -->
    <v-card
      v-else
      class="detail-card pass-frame"
      rounded="xl"
      tag="article"
      variant="flat"
    >
      <!-- Bandeau avec le numéro et le bouton favori (même composant que la carte) -->
      <pass-band :character="character" />

      <!-- no-gutters : pas d'espace entre les colonnes, on gère les marges nous-mêmes -->
      <v-row no-gutters>
        <!-- ===== Colonne gauche : identité ===== -->
        <!--
          Les marges intérieures sont sur une <div> DANS la colonne :
          avec no-gutters, Vuetify force « padding: 0 » sur les v-col
          (règle plus prioritaire que nos classes).
        -->
        <v-col class="detail-card__col-left" cols="12" md="5">
          <div class="detail-card__identity">
            <div class="detail-card__heading">
              <pass-photo
                :alt="character.name"
                :height="168"
                :src="getImageUrl(character.image)"
                :width="132"
              />
              <div class="detail-card__name-block">
                <div>
                  <span class="mono-label">Nom</span>
                  <!-- h1 : c'est le titre principal de cette page -->
                  <h1 class="detail-card__name">{{ character.name }}</h1>
                </div>
                <status-badge :status="character.status" />
              </div>
            </div>

            <div class="detail-card__infos">
              <info-field label="Espèce" :value="character.species" />
              <info-field label="Genre" :value="character.gender" />
            </div>
          </div>
        </v-col>

        <!-- ===== Colonne droite : trajet et apparitions ===== -->
        <v-col cols="12" md="7">
          <div class="detail-card__journey-col">
            <!-- Trajet dimensionnel : d'où il vient → où on l'a vu en dernier -->
            <section aria-label="Trajet dimensionnel" class="journey">
              <span class="mono-label">Trajet dimensionnel</span>
              <div class="journey__route">
                <info-field fallback="Inconnue" label="Origine" :value="character.origin" />
                <!-- Ligne pointillée entre les deux lieux : purement décorative -->
                <div aria-hidden="true" class="journey__line">
                  <span class="journey__dot" />
                  <span class="journey__dash" />
                  <span class="journey__dot journey__dot--filled" />
                </div>
                <info-field
                  class="journey__end"
                  fallback="Inconnue"
                  label="Dernière position"
                  :value="character.location"
                />
              </div>
            </section>

            <!-- 4 épisodes listés sur 2 colonnes, puis « + N autres épisodes » pour le reste -->
            <episode-samples :character="character" :columns="2" :count="4" />
          </div>
        </v-col>
      </v-row>

      <!-- Code-barres décoratif en bas de la fiche -->
      <div aria-hidden="true" class="detail-card__footer">
        <div class="pass-barcode" />
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import EpisodeSamples from '@/components/EpisodeSamples.vue'
  import InfoField from '@/components/InfoField.vue'
  import PassBand from '@/components/PassBand.vue'
  import PassPhoto from '@/components/PassPhoto.vue'
  import StatusBadge from '@/components/StatusBadge.vue'
  import api from '@/plugins/axios.js'
  import { getImageUrl } from '@/utils/imageUrl.js'

  // ===== État de la page =====
  // useRoute() lit l'adresse actuelle (dont le paramètre :id)
  const route = useRoute()
  const character = ref(null)
  // true dès le départ : sinon l'alerte « non trouvé » clignote avant la réponse de l'API
  const isLoading = ref(true)

  // ===== Appel de l'API au chargement de la page =====
  onMounted(async () => {
    try {
      // Un seul .data ici : pour un personnage seul, l'API ne met pas d'enveloppe { data, pagination }
      const response = await api.get(`/characters/${route.params.id}`)
      character.value = response.data
    } catch (error) {
      // Axios lève une erreur pour un 404 : character reste null → l'alerte s'affiche
      console.error(error)
    } finally {
      // finally s'exécute toujours (succès ou erreur) : le chargement est terminé
      isLoading.value = false
    }
  })
</script>

<style scoped>
/* La fiche est centrée et limitée à 1000px de large */
.detail-card {
  max-width: 1000px;
  margin: 0 auto;
}

/* Même largeur et même centrage que la fiche, avec un espace en dessous */
.detail-back {
  max-width: 1000px;
  margin: 0 auto 16px;
}

/* ----- Colonne gauche ----- */
/* La bordure est sur la colonne (pour couvrir toute sa hauteur), les marges sur la div intérieure */
.detail-card__col-left {
  /* Sur téléphone, les colonnes sont l'une sous l'autre : séparation en bas */
  border-bottom: 1px dashed rgba(var(--v-theme-primary), 0.4);
}

.detail-card__identity {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.detail-card__heading {
  display: flex;
  gap: 18px;
}

.detail-card__name-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 2px 0;
}

.detail-card__name {
  margin: 6px 0 0;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.detail-card__infos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 14px;
}

/* ----- Colonne droite ----- */
.detail-card__journey-col {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 24px;
}

/* Encadré « Trajet dimensionnel » légèrement teinté de vert */
.journey {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
}

/* flex-wrap : sur un écran étroit, les éléments passent à la ligne au lieu de déborder */
.journey__route {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}

/* La ligne prend la place libre entre l'origine et la dernière position */
.journey__line {
  display: flex;
  flex: 1 1 40px;
  align-items: center;
  min-width: 40px;
}

.journey__dot {
  width: 10px;
  height: 10px;
  border: 2px solid rgb(var(--v-theme-primary));
  border-radius: 50%;
}

.journey__dot--filled {
  background: rgb(var(--v-theme-primary));
}

.journey__dash {
  flex: 1;
  border-top: 2px dashed rgb(var(--v-theme-primary));
}

/* margin-left: auto pousse la dernière position contre le bord droit,
   même quand elle passe à la ligne sur un écran étroit */
.journey__end {
  margin-left: auto;
  text-align: right;
}

/* ----- Pied de la fiche ----- */
.detail-card__footer {
  margin: 0 24px 22px;
  padding-top: 18px;
  border-top: 1px dashed rgba(var(--v-theme-primary), 0.4);
}

/* À partir de 960px (point de rupture « md » de Vuetify) : 2 colonnes côte à côte,
   la séparation passe du bas à la droite de la colonne gauche */
@media (min-width: 960px) {
  .detail-card__col-left {
    border-right: 1px dashed rgba(var(--v-theme-primary), 0.4);
    border-bottom: 0;
  }
}
</style>
