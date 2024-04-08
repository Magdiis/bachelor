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

            <ion-row>
              <ion-col>
                <h3>{{profile.name}}, {{countAge(profile.date)}}</h3>
                <h6>{{profile.description}}</h6>

              </ion-col>
            </ion-row>


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
  IonImg
} from "@ionic/vue";
import {computed, ref} from "vue";
import {auth, storage} from "@/firebase-service";
import {globalProfile, globalProfilePhotoURl, useProfileStore} from "@/composables/store/profileStore";
import {ellipsisHorizontal, ellipsisVertical, logOutOutline, personRemoveOutline, pencilOutline} from "ionicons/icons";
import authentication from "@/composables/authentication/authentication";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
import {useGroupStore} from "@/composables/store/useGroupStore";
import { getDownloadURL , ref as storageRef } from "firebase/storage";
import getFromStorage from "@/composables/firebaseStorage/getFromStorage";
import {colorsCases} from "@/model/group/createGroupEnums";
import {Timestamp} from "firebase/firestore";


const profile = globalProfile
const router = useRouter()
const profileStore = useProfileStore()
const groupChatStore = useGroupChatStore()
const groupStore = useGroupStore()
const getStorage = getFromStorage()

const imgStyle = ref<Partial<CSSStyleDeclaration>>({
  background: "",
  height: '100vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})
onIonViewWillEnter(async ()=>{
  console.log("haloo")
  await getPhoto()
})
function logout(){
  authentication().logout()
  clearStores()
  navigate()
}

function navigate(){
  router.push({name: routesNames.Login})
}

function clearStores(){
  profileStore.clearProfile()
  groupChatStore.clear()
  groupStore.clear()
}

async function getPhoto(){
  const response = await getStorage.getPhoto(globalProfile.id)
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

</style>