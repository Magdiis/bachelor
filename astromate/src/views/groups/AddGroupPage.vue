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

    <ion-card @click="router.push({name: routesNames.SearchPeopleAdd})">
      <ion-card-header>
        <ion-card-title>
          Hledám lidi
        </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Po vytvoření bude uživatel hledat lidi do své skupiny
      </ion-card-content>
    </ion-card>


    <ion-card @click="router.push({name: routesNames.SearchGroupsAdd})">
      <ion-card-header>
        <ion-card-title>
          Hledám skupiny
        </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Po vytvoření bude uživatel hledat skupiny do kterých chce patřit
      </ion-card-content>
    </ion-card>

    

        </ion-content>
        </ion-page>

</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, 
IonHeader, IonToolbar, IonButtons, IonBackButton,
IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/vue';
import {add} from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { routesNames } from '@/router/routesNames';


const router = useRouter()


</script>

<style scoped>
</style>