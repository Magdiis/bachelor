<template>
<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vytvoření profilu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-vertical">

      <div class="ion-padding-horizontal">
        <ion-input class="custom" :counter="true" maxlength="20"  fill="outline"
                   :helper-text="validationValues.isUsernameEmpty ? 'povinné': validationValues.notUniqueUsername ? 'tato přezdívka je již obsazena' : '' "
                   label="Přezdívka" label-placement="floating"
                   error-text="Špatná přezdívka" v-model="profile.name"></ion-input>
      </div>

    <div class="ion-padding-horizontal ion-margin-top">
      <ion-textarea class="custom" :counter="true" maxlength="200"
                    :helper-text="validationValues.isDescriptionEmpty ? 'povinné': '' "
                    label="Popis" label-placement="floating" v-model="profile.description"
                    fill="outline" rows="3">

      </ion-textarea>
    </div>

      <div class="ion-padding-start ion-padding-bottom" >
        <p style="margin-bottom: 6px"> Poloha</p>
        <small>Poloha souží k výpočtu vzdálenosti mezi Vámi a hledanými uživateli.
          Jako výchozí poloha slouží souřadnice Prahy.</small>
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

      <div class="ion-padding-start">
        <p> Datum narození</p>
      </div>

      <div  class="center ion-padding-horizontal">
        <ion-datetime presentation="date"
                      :max="max"
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
        <ion-thumbnail>
          <ion-icon class="icon-style" :icon="cameraOutline"></ion-icon>
        </ion-thumbnail>
        <div v-if="validationValues.isPhotoEmpty"><p style="color: var(--ion-color-danger)">fotka je povinná</p> </div>
      </div>





      <div class="center">
        <ion-text v-if="validationValues.showErrorMessage" color="danger">Špatně vyplněný profil</ion-text>
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
  IonThumbnail,
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
import fetchingFirebase from "@/composables/fetchingFromFirestore";

const router = useRouter()
const profileStore = useProfileStore()
const { takePhoto, photo } = usePhotoGallery();
const {getCurrentPosition, checkPermissions, location} = useGeolocation()
const fetchFromFirebase = fetchingFirebase()

const buttonName = ref<string>("zjisti polohu")


const profile: Profile = reactive({
    id:"",
    name: "",
    description: "",
    date: "",
    place: {latitude:50.073658, longitude:14.418540 }
})

const validationValues = reactive({
  isUsernameEmpty: false,
  isDescriptionEmpty: false,
  isPhotoEmpty: false,
  notUniqueUsername: false,
  showErrorMessage: false
})


const now = computed(()=>{
  return new Date(Date.now())
})

const min = computed(()=>{
  return new Date(now.value.getFullYear() - 120,now.value.getMonth(),now.value.getDate()).toISOString()
})

const max = computed(()=>{
  return new Date(now.value.getFullYear() - 18,now.value.getMonth(),now.value.getDate()).toISOString()
})

onIonViewWillEnter(()=>{
  profile.date = max.value
  console.log(profile)
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
  const validation = await validate(profile.name)
  if(validation){
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
  } else {
    validationValues.showErrorMessage = true
  }

}

async function validate(username: string ): Promise<boolean>{
  validationValues.isUsernameEmpty = profile.name.length < 1
  validationValues.isDescriptionEmpty = profile.description.length < 1
  validationValues.isPhotoEmpty = photo.value == undefined
  if(!validationValues.isPhotoEmpty && !validationValues.isDescriptionEmpty && !validationValues.isUsernameEmpty){
    const profile = await fetchFromFirebase.isUsernameExist(username)
    if(profile){
      validationValues.notUniqueUsername = true
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

function clearProfile() {
  profile.name = ""
  profile.description = ""
  profile.place ={latitude:50.073658, longitude:14.418540 }
  profile.date = max.value
  photo.value = undefined

  validationValues.showErrorMessage = false
  validationValues.isUsernameEmpty = false
  validationValues.isDescriptionEmpty = false
  validationValues.isPhotoEmpty = false
  validationValues.notUniqueUsername = false
}

function navigate(){
  console.log("navigating to groups")
  router.push({name: routesNames.Groups, force: true})
}

</script>

<style scoped>


ion-thumbnail {
  --size: 140px;
}

.icon-style {
  width: 100%;
  height: 100%;
  color: #363636
}


</style>