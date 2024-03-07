<template>
    <ion-card>
      <ion-card-header>
          <ion-card-title>
              {{ props.user.name }}
          </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Profile name:  {{props.profile.name}}
        <ion-button fill="outline" @click="dislike()">
          Dislike
        </ion-button>
        <ion-button  @click="like()">
          Like
        </ion-button>
      </ion-card-content>
    </ion-card>
  
  </template>
  
  
  <script setup lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton} from '@ionic/vue';
  import type { User } from '@/model/User';
  import { routesNames } from '@/router/routesNames';
  import { useRouter } from 'vue-router';
  import {onMounted} from 'vue'
import { GroupsFilter } from '@/model/GroupsFilter';
import { returnCategory } from '@/composables/categoryConvertor';
  import {Profile} from "@/model/Profile";

  const router = useRouter()
  
  const props = defineProps<{
    user: User,
    profile: Profile
  }>()
  const emit = defineEmits(['like','dislike'])

  function like(){
    emit('like')
  }

  function dislike(){
    emit('dislike')
  }
  
  </script>
  
  <style scoped>
  </style>