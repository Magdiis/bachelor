<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button id="popover-trigger">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-popover trigger="popover-trigger" size="auto" :dismiss-on-select="true">
        <ion-content>
          <ion-list lines="none">
            <ion-item @click="navigateToEditProfile()">
              <ion-icon size="large" :icon="pencilOutline" class="ion-padding-end"></ion-icon>
              Upravit profil
            </ion-item>
            <ion-item @click="logout">
              <ion-icon size="large" :icon="logOutOutline" class="ion-padding-end"></ion-icon>
              Odhlásit se
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>
      <div :style="imgStyle"  v-if="imgStyle.background != '' "></div>
      <ion-skeleton-text :animated="true" style="height: 100vw" v-else></ion-skeleton-text>

      <div class="ion-padding-horizontal">
        <h3 style="color: var(--ion-color-blue)">{{profile.name}}, {{countAge(profile.date)}}</h3>
        <h6 style="background-color: var(--ion-color-blue-light);padding: 1em; border-radius: 12px">{{profile.description}}</h6>
      </div>
      <ion-row style="padding-left: 9px" class="ion-align-items-center">
        <ion-icon style="padding: 0; margin: 0" size="large" color="primary" :icon="locationOutline"></ion-icon>
        <p>lat: {{profile.place.latitude}}, lon: {{profile.place.longitude}}</p>
      </ion-row>


      <ion-loading :is-open="loading" message="Ukládání" spinner="lines-small" ></ion-loading>


    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonSkeletonText,
  IonContent,
  IonPopover,
  IonList,
  IonItem,
  IonHeader,
  IonIcon,
  IonText,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  onIonViewWillEnter,
  IonImg, IonLoading
} from "@ionic/vue";
import {computed, ref} from "vue";
import {auth, storage} from "@/firebase-service";
import {globalProfile, globalProfilePhotoURl, useProfileStore} from "@/composables/store/profileStore";
import {locationOutline,ellipsisHorizontal, ellipsisVertical, logOutOutline, personRemoveOutline, pencilOutline} from "ionicons/icons";
import authentication from "@/composables/authentication/authentication";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
import {useGroupStore} from "@/composables/store/useGroupStore";
import { getDownloadURL , ref as storageRef } from "firebase/storage";
import useStorage from "@/composables/firebaseStorage/useStorage";
import {colorsCases} from "@/model/group/createGroupEnums";
import {Timestamp} from "firebase/firestore";


const profile = globalProfile
const router = useRouter()
const profileStore = useProfileStore()
const groupChatStore = useGroupChatStore()
const groupStore = useGroupStore()
const firebaseStorage = useStorage()

const loading = ref(false)


const imgStyle = ref<Partial<CSSStyleDeclaration>>({
  background: "",
  height: '100vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})
onIonViewWillEnter(async ()=>{
  await getPhoto()
})
function logout(){
  loading.value = true
  authentication().logout()
  clearStores()
  navigate()
  loading.value = false
}

function navigate(){
  router.replace({name: routesNames.Login})
}

function clearStores(){
  profileStore.clearProfile()
  groupChatStore.clear()
  groupStore.clear()
  profileStore.clearURL()
  imgStyle.value.background = ''
}

async function getPhoto(){
  const response = await firebaseStorage.getPhoto(globalProfile.id)
  if (response.URL != undefined){
      imgStyle.value.background = `url("${response.URL}")`
      if(globalProfilePhotoURl.value === ""){
        globalProfilePhotoURl.value = response.URL
      }
  }
}

function countAge(birthday: string): string{
  const now = new Date(Date.now())

  const birthdayDate = new Date(birthday)


  // const difference = now.getTime() - birthdayTime
  //return new Date(difference).getFullYear().toString()

  // NOT EXACTLY. JUST DIFFERENCE IN FULL YEARS
  //TODO: CALCULATE EXACTLY USING getTime() METHOD
  return (now.getFullYear() - birthdayDate.getFullYear()).toString()
}

function navigateToEditProfile(){
  router.push({
    name:routesNames.EditProfile
  })
}


</script>


<style scoped>
ion-skeleton-text {
  margin-top: 0;
  margin-bottom: 0;
}
</style>