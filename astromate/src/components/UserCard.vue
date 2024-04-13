<template>
    <ion-card @click="setSelectedSearchedGroup()">
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
  import {globalSelectedSearchedGroup} from "@/composables/store/useGroupStore";

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

  function setSelectedSearchedGroup(){
    router.push({name: routesNames.GroupMatching, params:{groupsFilter:groupsFilterString}})
    Object.assign(globalSelectedSearchedGroup, props.user)
    console.log("setting global ", globalSelectedSearchedGroup)
  }

  </script>
  
  <style scoped>
  </style>