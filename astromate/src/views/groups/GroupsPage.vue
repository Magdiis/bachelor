<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Skupiny</ion-title>
        <ion-buttons slot="secondary">
            <ion-button  @click="router.push({name: routesNames.AddGroup})">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    <div v-if="!loading">
      <h4>Hledám lidi</h4>
    <div v-for="group in groups">
      <group-card :group="group"></group-card>
    </div>
    <h4>Hledám skupiny</h4>
    <div v-for="user in users">
     <user-card :user="user"></user-card>
    </div>
    </div>

    </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonIcon,
IonHeader, IonToolbar, IonButton,  IonButtons, IonLoading,
IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, onIonViewWillEnter, onIonViewDidEnter} from '@ionic/vue';
import {add} from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { routesNames } from '@/router/routesNames';
import {onMounted, ref, reactive} from 'vue'
import savingToFirestore from '@/composables/savingToFirestore'
import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
import type { Group } from '@/model/Group';
import type { User } from '@/model/User'
import GroupCard from '@/components/GroupCard.vue'
import UserCard from '@/components/UserCard.vue'

const router = useRouter()
const loading = ref(false)
//const groups = reactive<Array<Group>>([])
const groups = ref<Array<Group>>([])
const users = ref<Array<User>>([])


  onIonViewDidEnter(async()=>{
  console.log("Home page did enter")
  loading.value = true
  await fetchOwnGroups()
  await fetchOwnUsers()
  loading.value = false
})


async function fetchOwnGroups() {
    var userID = localStorage.getItem("userID")
    if (userID == null){
        userID = ""
    } 
    console.log("fetchOwnGroups")
    console.log(userID)
    const groupsFromFirebase = await fetchingFromFirestore().getOwnGroups(userID)
   // groups.length = 0 // clear
    //groups.push(...groupsFromFirebase) //push
    groups.value = []
    groups.value.push(...groupsFromFirebase)
    
}

async function fetchOwnUsers() {
  var userID = localStorage.getItem("userID")
    if (userID == null){
        userID = ""
    } 
    const usersFromFirebase = await fetchingFromFirestore().getOwnUsers(userID)
    users.value = []
    users.value.push(...usersFromFirebase)
    
}




</script>

<style scoped>
</style>