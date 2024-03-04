<template>
    <ion-card>
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
import { GroupsFilter } from '@/model/GroupsFilter';
import { returnCategory } from '@/composables/categoryConvertor';

  const router = useRouter()
  
  const props = defineProps<{
    user: User
  }>()

  onMounted(()=>{
  })
  
  </script>
  
  <style scoped>
  </style>