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
          {{ currentUser?.userId }}
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
    
    const router = useRouter()
    const route = useRoute()

    const currentUser = ref<User>()

    onIonViewDidEnter(()=>{
      getUserFromParams()
    })

    function getUserFromParams() {
      const userParam = route.params.user
      currentUser.value = JSON.parse(userParam.toString())
    }

    </script>
    
    <style scoped>
    
    </style>