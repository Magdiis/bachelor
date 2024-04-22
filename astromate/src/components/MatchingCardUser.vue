<template>
  <ion-row class="ion-justify-content-between">
    <ion-col class="ion-padding-start">
      <h1 style="margin-bottom: 0"> {{props.profile.name}}</h1>
      <h4 style="margin: 0; font-weight: normal">{{age}} let</h4>
    </ion-col>
    <ion-col size="auto"  style="padding-top: 0; padding-inline-end: 0;">
      <div class="ion-text-end">
        <div class="container">
          <ion-img style="width: 6em;" :src="colors.sphereCorner"></ion-img>
          <div class="centered">
            <ion-row style="flex-direction: column" class="ion-align-items-center">
              <ion-icon size="large" src="/compatibility/com-icon-white.svg"></ion-icon>
              <h3 style="padding: 0; margin: 0; font-weight: normal">68%</h3>
            </ion-row>
          </div>
        </div>
      </div>
    </ion-col>
  </ion-row>

  <div class="center">
    <div class="container">
      <ion-img style="width: 81vw" :src="colors.sphere"></ion-img>
      <div class="centered">
        <h2 v-if="props.url == 'error'">Chyba</h2>
        <h2 v-if="url == ''">Načítání..</h2>
        <img v-else style="border-radius: 50%; height: 76vw; width: 76vw" :src="props.url"/>
      </div>
    </div>
  </div>

  <div class="ion-padding">
    <ion-row class="ion-align-items-center">
      <div class="dot" :class="colors.dotColor">
        <ion-icon style="font-size: 1.6em" :icon="locationOutline"></ion-icon>
      </div>
      <p style="padding-left: 0.6em"> 18 km daleko</p>
    </ion-row>
  </div>

  <div class="ion-padding-horizontal" style="padding-bottom: 1em">
    <div :class="colors.descriptionBackground" style=" padding: 0.1em; border-radius: 12px">
      <p style="margin-left: 1em; margin-right: 1em"> {{props.profile.description}}</p>
    </div>
  </div>


  </template>
  
  
  <script setup lang="ts">
  import { IonButton, IonRow, IonCol, IonImg, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/vue';
  import type { User } from '@/model/group/User';
  import { routesNames } from '@/router/routesNames';
  import { useRouter } from 'vue-router';
  import {computed, onMounted, ref} from 'vue'
import { GroupsFilter } from '@/model/group/GroupsFilter';
import { returnCategory } from '@/composables/categoryConvertor';
  import {Profile} from "@/model/profile/Profile";
  import {colorsCases} from "@/model/group/createGroupEnums";
  import {settingsOutline, personOutline, person, locationOutline, telescopeOutline} from "ionicons/icons";


  const router = useRouter()




  const props = defineProps<{
    user: User,
    profile: Profile,
    color: colorsCases,
    url: string
  }>()

  const age = computed(()=>{

    const now = new Date(Date.now())
    const birthdayDate = new Date(props.profile.date)
    return (now.getFullYear() - birthdayDate.getFullYear()).toString()
  })


  // SRC + CLASSES
  const colors = computed(()=>{
    switch (props.color) {
      case colorsCases.Blue: {
        return {
          sphereCorner: "matching/sphere-blue-corner.svg",
          sphere: "matching/sphere-blue.svg",
          dotColor: "background-color-blue",
          descriptionBackground: "background-blue"
        }
      }
      case colorsCases.Green:{
        return {
          sphereCorner: "matching/sphere-green-corner.svg",
          sphere: "matching/sphere-green.svg",
          dotColor: "background-color-green",
          descriptionBackground: "background-green"
        }
      }
      case colorsCases.Orange:{
        return {
          sphereCorner: "matching/sphere-orange-corner.svg",
          sphere: "matching/sphere-orange.svg",
          dotColor: "background-color-orange",
          descriptionBackground: "background-orange"
        }
      }
      case colorsCases.Red:{
        return {
          sphereCorner: "matching/sphere-red-corner.svg",
          sphere: "matching/sphere-red.svg",
          dotColor: "background-color-red",
          descriptionBackground: "background-red"
        }
      }
      default:{
        return {
          sphereCorner: "matching/sphere-blue-corner.svg",
          sphere: "matching/sphere-blue.svg",
          dotColor: "background-color-blue",
          descriptionBackground: "background-blue"
        }
      }
    }
  })

// CSS

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


  .dot {
    height: 2.8em;
    width: 2.8em;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .background-color-green {
    background-color: var(--ion-color-green-lighter);
  }

  .background-color-blue {
    background-color: var(--ion-color-blue-lighter);
  }

  .background-green {
    background: var(--ion-color-green-lighter);
  }

  .background-blue {
    background: var(--ion-color-blue-lighter);
  }


  </style>