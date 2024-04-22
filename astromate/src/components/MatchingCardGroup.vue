<template>
  <ion-row  class="ion-justify-content-between">
    <ion-col>
      <h1>{{props.group.name}}</h1>
      <h4>{{props.group.currentMembers}}/{{props.group.maxMembers}}</h4>
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

  <div class="ion-padding-horizontal">
    <div :class="colors.descriptionBackground" style=" padding: 0.1em; border-radius: 12px">
      <p style="margin-left: 1em; margin-right: 1em">{{ props.group.name }}</p>
    </div>
  </div>

  <ion-list lines="none">
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
  import {settingsOutline} from "ionicons/icons";
  import {computed} from "vue";
  import {colorsCases} from "@/model/group/createGroupEnums";
  import ProfileRowInMatchingGroup from "@/components/ProfileRowInMatchingGroup.vue";
  
  const router = useRouter()
  
  const props = defineProps<{
    group: Group,
    profiles: Profile[],
    color: colorsCases
  }>()

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
  
  </style>