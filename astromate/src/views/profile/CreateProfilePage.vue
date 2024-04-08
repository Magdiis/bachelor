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

      <ion-button @click ='takePhoto()'> Fotka </ion-button>

    <ion-button @click ='createProfile()'> Uložit </ion-button>
    <ion-loading :is-open="loading" message="Ukládání" spinner="bubbles" ></ion-loading>

      <ion-img v-if="photo != undefined" :src="photo.webviewPath"></ion-img>

    </ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonInput,
  IonItem, IonLabel, IonList, IonTextarea, IonDatetime, IonButton,
  IonLoading, IonAlert,IonText, onIonViewDidEnter, IonImg
} from '@ionic/vue';
import type { Profile } from '@/model/profile/Profile.ts'
import { reactive, ref } from "vue";
//import { format, parseISO } from 'date-fns';
import savingToFirestore from '@/composables/savingToFirestore'
import {auth} from "@/firebase-service";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {globalProfile, useProfileStore} from "@/composables/store/profileStore";
import {savePicture, usePhotoGallery} from "@/composables/photos/usePhotoGallery";

const router = useRouter()
const profileStore = useProfileStore()
const { takePhoto, photo } = usePhotoGallery();



const profile: Profile = reactive({
    id:"",
    name: "",
    description: "",
    date: "",
    place: ""
})

const loading = ref(false)

async function createProfile() {
  loading.value = true
  if(globalProfile.id != ""){
    profile.id = globalProfile.id
    const answer = await (savingToFirestore().createProfile(profile))
    if(answer){
      if (photo.value != undefined){
        await savePicture(photo.value)
      }
      navigate()
    }
  }
  clearProfile()
  loading.value = false
}


function clearProfile() {
  profile.name = "",
  profile.description = "",
  profile.place = ""
}

function navigate(){
  router.push({name: routesNames.Groups})
}



// use watch() to check input length




</script>

<style scoped>


</style>