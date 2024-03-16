<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="logout()"> <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon> </ion-button>
        </ion-buttons>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-text>{{profile.id}}</ion-text>
      <ion-text>{{profile.name}}</ion-text>
    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">
import {IonContent, IonHeader,IonIcon, IonText, IonPage, IonTitle, IonToolbar,IonButtons, IonButton, onIonViewWillEnter} from "@ionic/vue";
import {ref} from "vue";
import {auth} from "@/firebase-service";
import {globalProfile} from "@/composables/store/profileStore";
import {logOutOutline} from "ionicons/icons";
import authentication from "@/composables/authentication/authentication";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";



// TODO: get info about user from Pinia

const profile = globalProfile
const router = useRouter()

function logout(){
  authentication().logout()
  navigate()
}

function navigate(){
  router.push({name: routesNames.Login})
}


</script>


<style scoped>

</style>