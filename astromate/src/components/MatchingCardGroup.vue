<template>
  <ion-row  class="ion-justify-content-between">
    <ion-col class="ion-padding-start">
      <h1 style="margin-bottom: 0">{{props.group.name}}</h1>
      <ion-row class="ion-align-items-center">
        <ion-icon size="large" :icon="peopleOutline"></ion-icon>
        <h4 style="padding: 0 0 0 0.2em;margin:0; font-weight: normal">{{props.group.currentMembers}}/{{props.group.maxMembers}}</h4>
      </ion-row>

    </ion-col>
    <ion-col size="auto"  style="padding-top: 0; padding-inline-end: 0;">
      <div class="ion-text-end">
        <div class="container">
          <ion-img style="width: 6em;" :src="colors.sphereCorner"></ion-img>
          <div class="centered">
            <ion-row class="ion-align-items-center com-icon-more-center">
              <ion-icon size="large" src="/compatibility/com-icon-white.svg"></ion-icon>
              <h3 class="compatibility-text">{{ sharedCompatibility }}%</h3>
            </ion-row>
          </div>
        </div>
      </div>
    </ion-col>
  </ion-row>

  <div class="ion-padding-horizontal ion-padding-top">
    <div :class="colors.descriptionBackground" style=" padding: 0.1em; border-radius: 12px">
      <p style="margin-left: 1em; margin-right: 1em">{{ props.group.name }}</p>
    </div>
  </div>

  <ion-list lines="none" class="ion-padding-top">
    <profile-row-in-matching-group  v-for="profile in props.profiles"
                                    :color="props.color" :profile="profile">
    </profile-row-in-matching-group>

  </ion-list>



  </template>
  
  
  <script setup lang="ts">
  import {
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, onIonViewDidEnter,
    IonGrid, IonRow, IonCol, IonButton, createAnimation, IonList, IonItem, IonIcon, IonImg
  } from '@ionic/vue';
  import type { Group } from '@/model/group/Group';
  import { useRouter } from 'vue-router';
  import {Profile} from "@/model/profile/Profile";
  import {peopleOutline, settingsOutline} from "ionicons/icons";
  import {computed, onBeforeMount, onMounted, reactive} from "vue";
  import {colorsCases} from "@/model/group/createGroupEnums";
  import ProfileRowInMatchingGroup from "@/components/ProfileRowInMatchingGroup.vue";
  
  const router = useRouter()
  
  const props = defineProps<{
    group: Group,
    profiles: Profile[],
    color: colorsCases,
    groupCom: number
  }>()

  const sharedCompatibility = computed(()=>{
    return props.groupCom
  })

  // SRC + CLASSES
  const colors = computed(()=>{
    switch (props.color) {
      case colorsCases.Blue: {
        return {
          sphereCorner: "matching/sphere-blue-corner.svg",
          descriptionBackground: "background-blue"
        }
      }
      case colorsCases.Green:{
        return {
          sphereCorner: "matching/sphere-green-corner.svg",
          descriptionBackground: "background-green"
        }
      }
      case colorsCases.Orange:{
        return {
          sphereCorner: "matching/sphere-orange-corner.svg",
          descriptionBackground: "background-orange"
        }
      }
      case colorsCases.Red:{
        return {
          sphereCorner: "matching/sphere-red-corner.svg",
          descriptionBackground: "background-red"
        }
      }
      default:{
        return {
          sphereCorner: "matching/sphere-blue-corner.svg",
          descriptionBackground: "background-blue"
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

  .background-green {
    background: var(--ion-color-green-lighter);
  }

  .background-blue {
    background: var(--ion-color-blue-lighter);
  }

  .background-red {
    background: var(--ion-color-darkRed-lighter);
  }

  .background-orange {
    background: var(--ion-color-orange-lighter);
  }


  .compatibility-text {
    padding: 0;
    margin: 0;
    font-weight: normal;
  }

  .com-icon-more-center {
    flex-direction: column;
    padding-left: 0.8em;
    padding-bottom: 0.8em
  }
  
  </style>