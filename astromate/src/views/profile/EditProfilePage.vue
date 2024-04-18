<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>Změna profilu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-vertical">
          <div class="ion-padding-horizontal">
            <ion-input :counter="true" maxlength="20" label="Přezdívka" fill="outline"
                       label-placement="floating" error-text="Špatná přezdívka" v-model="editedProfile.name"></ion-input>
          </div>

      <div class="ion-padding-horizontal ion-margin-top">
        <ion-textarea :counter="true" maxlength="200" label="Popis" label-placement="floating" v-model="editedProfile.description" fill="outline" rows="3"></ion-textarea>
      </div>

      <div class="ion-padding-start">
        <p> Datum narození</p>
      </div>

      <div  class="center ion-padding-horizontal">
        <ion-datetime presentation="date"
                      :max="now"
                      :min="min"
                      name="Datum narození"
                      v-model="editedProfile.date"
        ></ion-datetime>
      </div>

          <ion-row class="ion-justify-content-center">
            <ion-col size="auto">
              <div v-if="photo != undefined" class="centered-content">
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
                <ion-img :src="photo.webviewPath"></ion-img>
              </div>
              <div class="centered-content" v-else>
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
                <ion-thumbnail>
                  <ion-icon class="icon-style" :icon="cameraOutline"></ion-icon>
                </ion-thumbnail>
              </div>
            </ion-col>
          </ion-row>

      <div class="center">
        <ion-button @click="getLocation" shape="round" fill="clear" v-if="buttonName == 'aktualizovat polohu'">
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
          <ion-button expand="block" shape="round" @click="saveChanges()" >Uložit</ion-button>
      </div>

      <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">

import {
  IonCol,
    IonRow,
    IonImg,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonThumbnail,
  IonButton, IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar, onIonViewWillEnter, IonButtons, IonBackButton, onIonViewDidLeave
} from "@ionic/vue";
import {cameraOutline, checkmarkOutline, locationOutline, save} from 'ionicons/icons';
import {computed, reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";
import {globalProfile, globalProfilePhotoURl, useProfileStore} from "@/composables/store/profileStore";
import {useRouter} from "vue-router";
import {savePicture, usePhotoGallery} from "@/composables/photos/usePhotoGallery";
import updateInFirestore from "@/composables/updateInFirestore";
import {routesNames} from "@/router/routesNames";
import {useGeolocation} from "@/composables/geolocation/useGeolocation";

const { takePhoto, photo } = usePhotoGallery();
const profileStore = useProfileStore()
const router = useRouter()
const {getCurrentPosition, checkPermissions, location} = useGeolocation()

const editedProfile = reactive<Profile>({date: "", description: "", id: "", name: "", place: {longitude:0,latitude:0}})

const loading = ref(false)

const buttonName = ref<string>("aktualizovat polohu")

onIonViewWillEnter(()=>{
  setProfile()
})

onIonViewDidLeave(()=>{
  cleanPhoto()
})

function setProfile(){
  editedProfile.id = globalProfile.id
  editedProfile.date = globalProfile.date
  editedProfile.description = globalProfile.description
  editedProfile.name = globalProfile.name
  editedProfile.place = globalProfile.place
}

function cleanPhoto(){
  photo.value = undefined
}

async function getLocation(){
  buttonName.value = "načítání"
  const permissionResult = await checkPermissions()
  if (permissionResult === 'denied'){
    // TODO: upozorneni
    buttonName.value = "aktualizovat polohu"
  } else {
    await getCurrentPosition()
    if (location.value != undefined){
      editedProfile.place = {latitude: location.value.latitude, longitude: location.value.longitude}
      buttonName.value = "poloha zjištěna"

    } else {
      buttonName.value = "aktualizovat polohu"
    }
  }

}


async function saveChanges(){
  loading.value = true
  profileStore.setProfile(editedProfile)
  await (updateInFirestore().updateProfile(editedProfile))
  if(photo.value != undefined){
    await savePicture(photo.value)
  }
  await router.push({name:routesNames.Profile})
  loading.value = false
}

const now = computed(()=>{
  const now = new Date(Date.now())
  return now.toISOString()
})

const min = computed(()=>{
  const now = new Date(Date.now())
  return new Date(now.getFullYear() - 120,now.getMonth(),now.getDate()).toISOString()
})


</script>

<style scoped>
ion-thumbnail {
  --size: 140px;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-style {
  width: 100%;
  height: 100%;
  color: #363636
}

.center {
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center; /* Vertical centering */
  flex-direction: column; /* Align items in a column */
  text-align: center; /* Center text horizontally */
}

</style>