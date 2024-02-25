<template>
<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vytvoření profilu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
        
    <ion-input placeholder="Jméno" v-model="profile.name"></ion-input>
    <ion-textarea label="Popis" label-placement="floating" v-model="profile.description" fill="outline" rows="3"></ion-textarea>

    <ion-datetime presentation="date" 
    :prefer-wheel="true" 
    v-model="profile.date" 
     size="sized"
     ></ion-datetime>
    <ion-input placeholder="Místo"></ion-input>
    <ion-button @click ='createProfile()'> Save </ion-button>

    <ion-loading :is-open="loading" message="Ukládání" spinner="bubbles" ></ion-loading>
      
    </ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonInput, 
  IonItem, IonLabel, IonList, IonTextarea,IonDatetime, IonButton,
  IonLoading, IonAlert} from '@ionic/vue';
import type { Profile } from '@/model/Profile.ts'
import { reactive, ref } from "vue";
//import { format, parseISO } from 'date-fns';
import profilesFirebase from '@/composables/profilesFirebase'


const profile: Profile = reactive({
    name: "",
    description: "",
    date: "",
    place: ""
})

const loading = ref(false)

async function createProfile() {
  loading.value = true
  await profilesFirebase().createProfile(profile)
  clearProfile()
  loading.value = false
}


function clearProfile() {
  profile.name = "",
  profile.description = "",
  profile.place = ""
}





</script>

<style scoped>


</style>