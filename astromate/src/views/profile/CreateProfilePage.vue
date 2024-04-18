<template>
<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vytvoření profilu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-vertical">

      <div class="ion-padding-horizontal">
        <ion-input :counter="true" maxlength="20"  fill="outline" label="Přezdívka" label-placement="floating"
                   error-text="Špatná přezdívka" v-model="profile.name"></ion-input>
      </div>

    <div class="ion-padding-horizontal ion-margin-top">
      <ion-textarea :counter="true" maxlength="200" label="Popis" label-placement="floating" v-model="profile.description" fill="outline" rows="3"></ion-textarea>
    </div>

      <div class="ion-padding-start">
        <p> Datum narození</p>
      </div>

      <div  class="center ion-padding-horizontal">
        <ion-datetime presentation="date"
                      :max="now"
                      :min="min"
                      name="Datum narození"
                      v-model="profile.date"
        ></ion-datetime>
      </div>

      <div class="center">
        <ion-button fill="clear" @click ='takePhoto()'> Vybrat fotku </ion-button>
      </div>
      <ion-img style="height: 80vw;background-size: cover;background-position: center" v-if="photo != undefined" :src="photo.webviewPath"></ion-img>
      <div class="center"  v-else>
<!--        <div style=" border: #fa7676 solid; border-radius: 12px">-->
          <ion-icon style="height: 80vw; font-size: 80vw; color: #5b5b5b;" :icon="cameraOutline"></ion-icon>
<!--        </div>-->
      </div>

      <div class="center">
        <ion-button @click="getLocation" shape="round" fill="clear" v-if="buttonName == 'zjisti polohu'">
          <ion-icon slot="start" :icon="locationOutline"></ion-icon>
          {{buttonName}}
        </ion-button>
        <ion-button :disabled="true" shape="round" fill="clear" v-else-if="buttonName == 'načítání'">
          {{buttonName}}
        </ion-button>
        <ion-button  color="success" shape="round" fill="clear" v-else>
          <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
          {{buttonName}}
        </ion-button>
      </div>

      <div class="ion-padding">
        <ion-button expand="block" shape="round" @click ='createProfile()'> Uložit </ion-button>
      </div>

      <ion-loading :is-open="loading" message="Ukládání" spinner="bubbles" ></ion-loading>
    </ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonInput,
  IonItem, IonLabel, IonList, IonTextarea, IonDatetime, IonButton,
  IonLoading, IonAlert, IonText, onIonViewDidEnter, IonImg, onIonViewWillEnter, IonIcon, IonCol
} from '@ionic/vue';
import type { Profile } from '@/model/profile/Profile.ts'
import {computed, reactive, ref} from "vue";
//import { format, parseISO } from 'date-fns';
import savingToFirestore from '@/composables/savingToFirestore'
import {auth} from "@/firebase-service";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {globalProfile, useProfileStore} from "@/composables/store/profileStore";
import {savePicture, usePhotoGallery} from "@/composables/photos/usePhotoGallery";
import {person, cameraOutline, locationOutline, checkmarkOutline} from "ionicons/icons";
import {useGeolocation} from "@/composables/geolocation/useGeolocation";

const router = useRouter()
const profileStore = useProfileStore()
const { takePhoto, photo } = usePhotoGallery();
const {getCurrentPosition, checkPermissions, location} = useGeolocation()

const buttonName = ref<string>("zjisti polohu")


const profile: Profile = reactive({
    id:"",
    name: "",
    description: "",
    date: "",
    place: {latitude:50.073658, longitude:14.418540 }
})
const now = computed(()=>{
  const now = new Date(Date.now())
  return now.toISOString()
})

const min = computed(()=>{
  const now = new Date(Date.now())
  return new Date(now.getFullYear() - 120,now.getMonth(),now.getDate()).toISOString()
})

onIonViewWillEnter(()=>{
  // TODO: check if date is not in the future
  profile.date = now.value
  console.log(profile.place)
})

async function getLocation(){
  buttonName.value = "načítání"
  const permissionResult = await checkPermissions()
  if (permissionResult === 'denied'){
   // TODO: upozorneni
    buttonName.value = "zjisti polohu"
  } else {
    await getCurrentPosition()
    if (location.value != undefined){
      profile.place = {latitude: location.value.latitude, longitude: location.value.longitude}
      buttonName.value = "poloha zjištěna"
      console.log(profile.place)
    } else {
      buttonName.value = "zjisti polohu"
    }
  }

}


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
  profile.name = ""
  profile.description = ""
  profile.place ={latitude:50.073658, longitude:14.418540 }
  photo.value = undefined
}

function navigate(){
  console.log("navigating to groups")
  router.push({name: routesNames.Groups, force: true})
}



// use watch() to check input length




</script>

<style scoped>
.center {
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center; /* Vertical centering */
  flex-direction: column; /* Align items in a column */
  text-align: center; /* Center text horizontally */
}

</style>