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
      <ion-button @click ='showUser()'> showUser </ion-button>
      <ion-text>{{userID}}</ion-text>
    <ion-loading :is-open="loading" message="Ukládání" spinner="bubbles" ></ion-loading>
      
    </ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonInput,
  IonItem, IonLabel, IonList, IonTextarea, IonDatetime, IonButton,
  IonLoading, IonAlert, onIonViewDidEnter
} from '@ionic/vue';
import type { Profile } from '@/model/Profile.ts'
import { reactive, ref } from "vue";
//import { format, parseISO } from 'date-fns';
import savingToFirestore from '@/composables/savingToFirestore'
import {auth} from "@/firebase-service";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";

const router = useRouter()

const userID = ref("")


onIonViewDidEnter(()=>{

})

function showUser(){
  if(auth.currentUser){
    userID.value = auth.currentUser.uid
  }
}
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
  if(auth.currentUser){
    profile.id = auth.currentUser.uid
    const answer = await (savingToFirestore().createProfile(profile))
    if(answer){
      saveToPinia()
      navigate()
    }
  } else {
    console.error("Je to v pici neni ID")
  }
  clearProfile()
  loading.value = false
}


function clearProfile() {
  profile.name = "",
  profile.description = "",
  profile.place = ""
}

function saveToPinia(){

}

function navigate(){
  router.push({name: routesNames.Groups})
}



// use watch() to check input length




</script>

<style scoped>


</style>