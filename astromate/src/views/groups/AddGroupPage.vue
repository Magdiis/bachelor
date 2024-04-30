<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
          </ion-buttons>
          <ion-title>Hledám</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item id="add-group-selection-button" @click="router.push({name: routesNames.SearchPeopleAdd})" :button="true">
          <ion-row>
            <ion-col>
              <ion-row class="ion-align-items-center" style="margin-top: 1em;">
                <ion-icon size="large" src="/user/user-request-icon.svg"></ion-icon>
                <h1 style="color: var(--ion-color-blue); padding: 0; margin: 0 0 0 0.5em;">Hledám lidi</h1>
              </ion-row>
              <p>Vytvoření vlastní skupiny do které budete moct zvát uživatele</p>
            </ion-col>
          </ion-row>
        </ion-item>

        <ion-item id="add-searched-group-selection-button" @click="router.push({name: routesNames.SearchGroupsAdd})" :button="true">
          <ion-row>
            <ion-col>
              <ion-row class="ion-align-items-center" style="margin-top: 1em;">
                <ion-icon size="large" src="/user/searching-group-icon-blue.svg"></ion-icon>
                <h1 style="color: var(--ion-color-blue); padding: 0; margin: 0 0 0 0.5em;">Hledám skupiny</h1>
              </ion-row>
              <p>Chci se přidat do existující skupiny jiného uživatele</p>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>

</template>
<script setup lang="ts">
import {
  IonIcon,
    IonRow,
    IonList, IonCol,
  IonPage,
  IonContent,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave
} from '@ionic/vue';
import {add} from 'ionicons/icons'
import {useRouter} from 'vue-router';
import {routesNames} from '@/router/routesNames';


const router = useRouter()

</script>

<style scoped>

</style>