<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Hledám</ion-title>
        <ion-buttons slot="end">
            <ion-button id="navigate-to-create-group-button" @click="router.push({name: routesNames.AddGroup})">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    <div v-if="!loading">
      <no-searching v-if="areOwnGroupsEmpty"></no-searching>
      <ion-list v-else>
        <ion-list-header  v-if="globalOwnGroups.length > 0">
            <h4>
              Hledám lidi
            </h4>
        </ion-list-header>
        <own-group-row v-for="group in globalOwnGroups" :own-group="group"></own-group-row>

        <ion-list-header v-if="globalOwnSearchedGroups.length > 0">
          <h4>
            Hledám skupiny
          </h4>
        </ion-list-header>
        <own-searched-group-row v-for="user in globalOwnSearchedGroups" :ownUser="user"></own-searched-group-row>
      </ion-list>
    </div>

    </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonIcon,
IonHeader, IonToolbar, IonButton,  IonButtons, IonLoading,
IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,  onIonViewWillEnter,
 onIonViewDidEnter, IonList, IonListHeader, IonItem} from '@ionic/vue';
import {add} from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { routesNames } from '@/router/routesNames';
import {onMounted, ref, reactive} from 'vue'
import OwnGroupRow from "@/components/search/OwnGroupRow.vue";
import OwnSearchedGroupRow from "@/components/search/OwnSearchedGroupRow.vue";
import NoSearching from "@/components/placeholders/NoSearching.vue";
import {
  areOwnGroupsEmpty,
  globalOwnGroups,
  globalOwnSearchedGroups,
  useOwnGroupStore
} from "@/composables/store/useOwnGroupStore";

const router = useRouter()


const ownGroupStore = useOwnGroupStore()
const loading = ref(false)


onIonViewWillEnter(async()=>{
  loading.value = true
  await ownGroupStore.getGroupsFromBackend()
  loading.value = false
})




</script>

<style scoped>
</style>