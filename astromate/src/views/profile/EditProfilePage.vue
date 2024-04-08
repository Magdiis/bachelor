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

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-row>
        <ion-col >
          <ion-input label="Jméno" v-model="editedProfile.name"></ion-input>
          <ion-textarea label="Popis" label-placement="floating" v-model="editedProfile.description" fill="outline" rows="3"></ion-textarea>

          <ion-datetime presentation="date"
                        :prefer-wheel="true"
                        v-model="editedProfile.date"
                        size="sized"
          ></ion-datetime>
          <ion-input label="místo" placeholder="Místo"></ion-input>
          <ion-row class="ion-justify-content-center">
            <ion-col size="auto">
              <div v-if="photo != undefined" class="centered-content">
                <ion-img :src="photo.webviewPath"></ion-img>
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
              </div>
              <div class="centered-content" v-else>
                <ion-thumbnail>
                  <ion-icon class="icon-style" :icon="cameraOutline"></ion-icon>
                </ion-thumbnail>
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
              </div>
            </ion-col>
          </ion-row>

          <ion-button @click="saveChanges()" class="ion-padding-top" expand="block">Uložit</ion-button>
        </ion-col>
      </ion-row>

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
import {cameraOutline, save} from 'ionicons/icons';
import {reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";
import {globalProfile, globalProfilePhotoURl, useProfileStore} from "@/composables/store/profileStore";
import {useRouter} from "vue-router";
import {savePicture, usePhotoGallery} from "@/composables/photos/usePhotoGallery";
import updateInFirestore from "@/composables/updateInFirestore";
import {routesNames} from "@/router/routesNames";

const { takePhoto, photo } = usePhotoGallery();
const profileStore = useProfileStore()
const router = useRouter()

const editedProfile = reactive<Profile>({date: "", description: "", id: "", name: "", place: ""})

const loading = ref(false)

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

</style>