<template>
  <ion-modal :is-open="isProfileDetailOpen">
    <ion-content :class="colors.modalBackground">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="isProfileDetailOpen = false"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
      <div :style="imgStyle" v-if="imgStyle.background != ''"></div>
      <ion-skeleton-text :animated="true" style="height: 100vw" v-else></ion-skeleton-text>
      <div class="ion-padding-horizontal">
        <h3>{{profile.name}}, {{age}}</h3>

        <ion-row class="ion-align-items-center">
          <div class="dot" :class="colors.dotColor">
            <ion-icon style="font-size: 1.6em" :icon="locationOutline"></ion-icon>
          </div>
          <p style="padding-left: 0.6em"> {{distance}} </p>
        </ion-row>

        <h6 :class="colors.descriptionBackground" style="padding: 1em; border-radius: 12px">{{profile.description}}</h6>
          <div class="ion-padding-bottom" style="padding-top: 1em">
            <scrolling-characteristics
                :temperament="profile.temperament"
                :handy="profile.handy"
                :plan="profile.plan"
                :thinking="profile.thinking"
                :color="props.color"></scrolling-characteristics>
          </div>


<!--        <ion-row class="ion-align-items-center">-->
<!--          <div class="dot" :class="colors.dotColor">-->
<!--            <ion-icon size="large" src="/compatibility/com-icon-white.svg"></ion-icon>-->
<!--          </div>-->
<!--          <p style="padding-left: 0.6em"> {{ compatibility }}%</p>-->
<!--        </ion-row>-->
      </div>

    </ion-content>
  </ion-modal>

<ion-item @click="isProfileDetailOpen = true" :button="true" style="color: white">
  <ion-row style="width: 100%" class="ion-align-items-center ">
    <ion-col size="auto">
      <div class="container">
        <ion-img style="width: 10vw" :src="colors.sphere"></ion-img>
        <div class="centered">
          <img v-if="currentProfilePhotoUrl != '' " style="border-radius: 50%; height: 8vw; width: 8vw" :src="currentProfilePhotoUrl" />
          <ion-icon v-else style="font-size: 6vw" :icon="person"></ion-icon>
        </div>
      </div>

    </ion-col>
    <ion-col>
      {{profile.name}}
    </ion-col>
    <ion-col class="ion-text-end">
      {{ compatibility }}%
    </ion-col>
  </ion-row>
</ion-item>

</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonModal,
  IonRow,
  IonSkeletonText,
  IonToolbar
} from '@ionic/vue';

import {Profile} from "@/model/profile/Profile";
import {colorsCases} from "@/model/group/createGroupEnums";
import {computed, onBeforeMount, onMounted, ref} from "vue";
import useStorage from "@/composables/firebaseStorage/useStorage";
import {locationOutline, person, settingsOutline} from 'ionicons/icons'
import {getDistance} from "geolib";
import {globalProfile} from "@/composables/store/profileStore";
import {useCompatibility, userPlanets} from "@/composables/empheremis/useCompatibility";
import {usePlanetEphemeris} from "@/composables/empheremis/useEmpheremis";

import ScrollingCharacteristics from "@/components/profile/scrollingCharacteristics.vue";


const firebaseStorage = useStorage()
const planetEphemeris = usePlanetEphemeris()

const currentProfilePhotoUrl = ref("")
const isProfileDetailOpen = ref<boolean>(false)

const props = defineProps<{
  profile: Profile,
  color: colorsCases
}>()

const profileId = computed(()=>{
  return props.profile.id
})


onMounted(async ()=>{
  await getPhoto(profileId.value)

})
async function getPhoto(profileId: string){
  const responseStorage  = await firebaseStorage.getPhoto(profileId)
  if(responseStorage.URL != undefined){
    currentProfilePhotoUrl.value = responseStorage.URL
    imgStyle.value.background = `url("${responseStorage.URL}")`
  } else if (responseStorage.error != undefined){
    currentProfilePhotoUrl.value = 'error'
  }
}

const distance = computed(()=>{
  const distance = getDistance(
      {latitude: globalProfile.place.latitude, longitude: globalProfile.place.longitude},
      {latitude: props.profile.place.latitude, longitude: props.profile.place.longitude})
  const toKm = Math.round(distance/1000)
  if (toKm < 2){
    return "poblíž"
  } else {
    return `${toKm} km daleko`
  }
})

const compatibility = computed(()=>{
  const userPlanets1: userPlanets = planetEphemeris.getPlanetsEphemeris(globalProfile.date,globalProfile.place.latitude,globalProfile.place.longitude)
  const userPlaners2: userPlanets = planetEphemeris.getPlanetsEphemeris(props.profile.date, props.profile.place.latitude, props.profile.place.longitude)
  const{ compatibilityResult, numberOfSquare} = useCompatibility(userPlanets1, userPlaners2)
  return compatibilityResult()
})

const age = computed(()=>{
  const now = new Date(Date.now())
  const birthdayDate = new Date(props.profile.date)
  return (now.getFullYear() - birthdayDate.getFullYear()).toString()
})

const imgStyle = ref<Partial<CSSStyleDeclaration>>({
  background: "",
  height: '100vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})


const colors = computed(()=>{
  switch (props.color) {
    case colorsCases.Blue: {
      return {
        sphere: "matching/sphere-blue.svg",
        modalBackground: "modal-background-blue",
        descriptionBackground: "description-background-blue",
        dotColor: "background-color-blue"
      }
    }
    case colorsCases.Green:{
      return {
        sphere: "matching/sphere-green.svg",
        modalBackground: "modal-background-green",
        descriptionBackground: "description-background-green",
        dotColor: "background-color-green"
      }
    }
    case colorsCases.Orange:{
      return {
        sphere: "matching/sphere-orange.svg",
        modalBackground: "modal-background-orange",
        descriptionBackground: "description-background-orange",
        dotColor: "background-color-orange"
      }
    }
    case colorsCases.Red:{
      return {
        sphere: "matching/sphere-red.svg",
        modalBackground: "modal-background-red",
        descriptionBackground: "description-background-red",
        dotColor: "background-color-red"
      }
    }
    default:{
      return {
        sphere: "matching/sphere-blue.svg",
        modalBackground: "modal-background-blue",
        descriptionBackground: "description-background-blue",
      }
    }
  }
})
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
}

.centered {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background-blue {
  --background: var(--ion-color-blue);
  --color: white;
}
.modal-background-red {
  --background: var(--ion-color-darkRed);
  --color: white;
}
.modal-background-green {
  --background: var(--ion-color-green);
  --color: white;
}
.modal-background-orange {
  --background: var(--ion-color-orange);
  --color: white;
}

.description-background-green {
  background: var(--ion-color-green-lighter);
}

.description-background-blue {
  background: var(--ion-color-blue-lighter);
}

.background-color-green {
  background-color: var(--ion-color-green-lighter);
}

.background-color-blue {
  background-color: var(--ion-color-blue-lighter);
}


.dot {
  height: 2.8em;
  width: 2.8em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>