<template>
  <ion-row class="ion-justify-content-between">
    <ion-col>
      <h1>{{props.profile.name}}</h1>
      <h4>{{age}} let</h4>
    </ion-col>
    <ion-col size="auto"  style="padding-top: 0; padding-inline-end: 0;">
      <div class="ion-text-end">
        <div class="container">
          <ion-img style="width: 6.5em;" :src="colors.sphereCorner"></ion-img>
          <div class="centered">
            <ion-row style="flex-direction: column" class="ion-align-items-center">
              <ion-icon size="large" :icon="settingsOutline"></ion-icon>
              <h3 style="padding: 0; margin: 0">68%</h3>
            </ion-row>
          </div>
        </div>
      </div>
    </ion-col>
  </ion-row>

  <div class="center">
    <div class="container">
      <ion-img style="width: 60vw" :src="colors.sphere"></ion-img>
      <div class="centered">
        <h2 v-if="props.url == 'error'">Chyba</h2>
        <h2 v-if="url == ''">Načítání..</h2>
        <img v-else style="border-radius: 50%; height: 56vw; width: 56vw" :src="props.url"/>
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

  <div class="ion-padding-horizontal">
    <div :class="colors.descriptionBackground" style=" padding: 0.1em; border-radius: 12px">
      <p style="margin-left: 1em"> {{props.profile.description}}</p>
    </div>
  </div>



  <ion-row>
    <ion-col >
      <ion-row  class="ion-justify-content-around">
        <ion-img @click="dislike()"  @mousedown="down(false)" :style="buttonStyleDislike" :src="colors.dislike" ></ion-img>
        <ion-img @click="like()" @mousedown="down(true)" :style="buttonStyleLike" :src="colors.like" ></ion-img>
      </ion-row>
    </ion-col>
  </ion-row>

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
  const emit = defineEmits(['like','dislike'])

  const age = computed(()=>{

    const now = new Date(Date.now())
    const birthdayDate = new Date(props.profile.date)
    return (now.getFullYear() - birthdayDate.getFullYear()).toString()
  })

  function like(){
    emit('like')
  }

  function dislike(){
    emit('dislike')
  }

  // SRC + CLASSES
  const colors = computed(()=>{
    switch (props.color) {
      case colorsCases.Blue: {
        return {
          like: "matching/like-blue.svg",
          dislike: "matching/dislike-blue.svg",
          sphereCorner: "matching/sphere-blue-corner.svg",
          sphere: "matching/sphere-blue.svg",
          dotColor: "background-color-blue",
          descriptionBackground: "background-blue"
        }
      }
      case colorsCases.Green:{
        return {
          like: "matching/like-green.svg",
          dislike: "matching/dislike-green.svg",
          sphereCorner: "matching/sphere-green-corner.svg",
          sphere: "matching/sphere-green.svg",
          dotColor: "background-color-green",
          descriptionBackground: "background-green"
        }
      }
      case colorsCases.Orange:{
        return {
          like: "matching/like-orange.svg",
          dislike: "matching/dislike-orange.svg",
          sphereCorner: "matching/sphere-orange-corner.svg",
          sphere: "matching/sphere-orange.svg",
          dotColor: "background-color-orange",
          descriptionBackground: "background-orange"
        }
      }
      case colorsCases.Red:{
        return {
          like: "matching/like-red.svg",
          dislike: "matching/dislike-red.svg",
          sphereCorner: "matching/sphere-red-corner.svg",
          sphere: "matching/sphere-red.svg",
          dotColor: "background-color-red",
          descriptionBackground: "background-red"
        }
      }
      default:{
        return {
          like: "matching/like-blue.svg",
          dislike: "matching/dislike-blue.svg",
          sphereCorner: "matching/sphere-blue-corner.svg",
          sphere: "matching/sphere-blue.svg",
          dotColor: "background-color-blue",
          descriptionBackground: "background-blue"
        }
      }
    }
  })

// CSS
  // clicking on button
  const buttonStyleLike = ref<Partial<CSSStyleDeclaration>>({
    width: '20vw',
    scale: '1'
  })

  const buttonStyleDislike = ref<Partial<CSSStyleDeclaration>>({
    width: '20vw',
    scale: '1'
  })

  const down = (like:boolean)=>{
    if(like){
      buttonStyleLike.value.scale = '0.9'
      setTimeout(()=>{
        buttonStyleLike.value.scale = '1'
      },70)
    } else {
      buttonStyleDislike.value.scale = '0.9'
      setTimeout(()=>{
        buttonStyleDislike.value.scale = '1'
      },70)
    }
  }
  
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

  .center {
    display: flex;
    justify-content: center; /* Horizontal centering */
    align-items: center; /* Vertical centering */
    flex-direction: column; /* Align items in a column */
    text-align: center; /* Center text horizontally */
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