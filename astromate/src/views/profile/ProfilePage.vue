<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
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
import {IonContent, IonHeader, IonText, IonPage, IonTitle, IonToolbar, onIonViewWillEnter} from "@ionic/vue";
import {ref} from "vue";
import {auth} from "@/firebase-service";
import {globalProfile} from "@/composables/store/profileStore";



// TODO: get info about user from Pinia

const profile = globalProfile

</script>


<style scoped>

</style>