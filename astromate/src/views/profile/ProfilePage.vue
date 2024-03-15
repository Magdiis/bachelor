<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-text>{{id}}</ion-text>

    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">
import {IonContent, IonHeader, IonText, IonPage, IonTitle, IonToolbar, onIonViewWillEnter} from "@ionic/vue";
import {ref} from "vue";
import {auth} from "@/firebase-service";


// TODO: get info about user from Pinia

const id = ref()

onIonViewWillEnter(()=>{
  id.value = auth.currentUser?.uid
})
</script>


<style scoped>

</style>