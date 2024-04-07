<template>
    <ion-card @click="router.push({name: routesNames.GroupMatching, params:{groupsFilter:groupsFilterString}})">
      <ion-card-header>
          <ion-card-title>
              {{ props.user.name }}
          </ion-card-title>
          
      </ion-card-header>
    </ion-card>
  
  </template>
  
  
  <script setup lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
  import type { User } from '@/model/group/User';
  import { routesNames } from '@/router/routesNames';
  import { useRouter } from 'vue-router';
  import {onMounted} from 'vue'
import { GroupsFilter } from '@/model/group/GroupsFilter';
import { returnCategory } from '@/composables/categoryConvertor';

  const router = useRouter()
  
  const props = defineProps<{
    user: User
  }>()

  var groupsFilterString: string = ""

  onMounted(()=>{
    var groupsFilter: GroupsFilter = {
      userOrGroupID_card: props.user.id,
      userId: props.user.userId,
    useCase: props.user.useCase,
    category: returnCategory(props.user.useCase,
    props.user.workCase, 
    props.user.sportCase),
      name: props.user.name
    }
    groupsFilterString = JSON.stringify(groupsFilter)
  })
  
  </script>
  
  <style scoped>
  </style>