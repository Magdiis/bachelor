<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Hledám skupiny</ion-title>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <div class="ion-padding-horizontal ion-padding-top">
      <ion-select interface="popover" label="Barevný motiv"  v-model="user.color">
            <ion-select-option v-for="color in colorsCasesValues">
                {{ color }}
            </ion-select-option>
        </ion-select>
      </div>


      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Účel" placeholder="Práce" v-model="user.useCase">
            <ion-select-option v-for="uC in useCasesValues">
                {{ uC }}
            </ion-select-option>
        </ion-select>
      </div>

        <div class="ion-padding-horizontal ion-padding-top" v-if="user.useCase == useCase.Work">
            <ion-select interface="popover" label="Kategorie" v-model="user.workCase">
            <ion-select-option v-for="wC in workCasesValues">
                {{ wC }}
            </ion-select-option>
        </ion-select>
        </div>

        <div class="ion-padding-horizontal ion-padding-top" v-if="user.useCase == useCase.Sport">
        <ion-select interface="popover" label="Druh" placeholder="Kategorie" v-model="user.sportCase">
            <ion-select-option v-for="sC in sportCasesValues">
                {{ sC }}
            </ion-select-option>
        </ion-select>
        </div>

      <ion-button  expand="block" shape="round" class="ion-padding" @click="saveToDb()" >Uložit</ion-button>
        <ion-loading :is-open="loading" message="Ukládání" spinner="lines-small" ></ion-loading>

      
    </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, 
IonHeader, IonToolbar, IonBackButton, IonButtons,
IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, 
IonLoading, onIonViewDidEnter, onIonViewWillEnter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import type { User } from '@/model/group/User';
import { reactive, ref } from 'vue';
import savingToFirestore from '@/composables/savingToFirestore'
import { routesNames } from '@/router/routesNames';

import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
  sportCasesValues, colorsCases, colorsCasesValues} from '@/model/group/createGroupEnums'
import {auth} from "@/firebase-service";



const router = useRouter()


const user: User = reactive({
    id:"",
    userId: "",
  groupName: "",
    useCase: useCase.Work,
    workCase:workCases.Other,
    sportCase:SportCases.Other,
    color:colorsCases.Blue,
    groupId: ""
})

/*
onIonViewDidEnter(() => {
  clearUser()
}) */

onIonViewWillEnter(()=> {
  clearUser()
  if(auth.currentUser != null){
    user.userId = auth.currentUser.uid
  }

})

const loading = ref(false)

async function saveToDb() {
    loading.value = true
    clean()
    await savingToFirestore().createUser(user)
    clearUser()
    loading.value = false
    navigateToGroupScreen()
}



function navigateToGroupScreen(){
    router.push({name: routesNames.Groups})
}

function clean(){
    if (user.useCase == useCase.Friendship){
      user.sportCase = ""
      user.workCase = ""
    }
    if (user.useCase == useCase.Relationship){
      user.sportCase = ""
      user.workCase = ""
    }
    if (user.useCase == useCase.Sport){
      user.workCase = ""
    }

    if (user.useCase == useCase.Work){
      user.sportCase = ""
    }
}

function clearUser(){
  user.userId= ""
  user.groupName = ""
  user.useCase= useCase.Work
  user.workCase=workCases.Other
  user.sportCase=SportCases.Other
  user.color=colorsCases.Blue
  user.groupId=""
}


</script>

<style scoped>
</style>