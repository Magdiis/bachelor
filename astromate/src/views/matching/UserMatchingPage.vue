<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>User matching</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true">
          {{ groupsFilter?.userId }}
          <div v-for="u in users">
            {{ u.name }}
          </div>
        </ion-content>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import { IonPage, IonContent, IonTitle, 
    IonHeader, IonToolbar,IonButtons, IonBackButton, IonButton, IonRow, IonCol, IonGrid} from '@ionic/vue';
    import { useRouter, useRoute } from 'vue-router';
    import { onIonViewDidEnter } from '@ionic/vue';
    import { ref } from 'vue';
    import type { User } from '@/model/User';
    import { GroupsFilter } from '@/model/GroupsFilter';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'

    
    const router = useRouter()
    const route = useRoute()

    const groupsFilter = ref<GroupsFilter>()

    const users =  ref<Array<User>>([])

    onIonViewDidEnter(()=>{
      getGroupsFilterFromParams()
      fetchOthersUsers()
    })

    function getGroupsFilterFromParams() {
        const groupsFilterParam = route.params.groupsFilter 
        groupsFilter.value = JSON.parse(groupsFilterParam.toString())
    }

    </script>
    
    <style scoped>
    
    </style>