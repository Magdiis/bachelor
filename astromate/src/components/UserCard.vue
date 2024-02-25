<template>
    <ion-card @click="router.push({name: routesNames.UserMatching, params:{user:userJSON}})">
      <ion-card-header>
          <ion-card-title>
              {{ props.user.name }}
          </ion-card-title>
      </ion-card-header>
    </ion-card>
  
  </template>
  
  
  <script setup lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
  import type { User } from '@/model/User';
  import { routesNames } from '@/router/routesNames';
  import { useRouter } from 'vue-router';
  import {onMounted} from 'vue'

  const router = useRouter()
  
  const props = defineProps<{
    user: User
  }>()

  var userJSON: string = ""

  onMounted(()=>{
      userJSON = JSON.stringify(props.user)
  })
  
  </script>
  
  <style scoped>
  </style>