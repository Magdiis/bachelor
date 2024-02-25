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

      <ion-input placeholder="Jméno" v-model="user.name"></ion-input>
      <ion-select interface="popover" label="Barva"  v-model="user.color">
            <ion-select-option v-for="color in colorsCasesValues">
                {{ color }}
            </ion-select-option>
        </ion-select>

        <ion-select interface="popover" label="Účel" placeholder="Práce" v-model="user.useCase">
            <ion-select-option v-for="uC in useCasesValues">
                {{ uC }}
            </ion-select-option>
        </ion-select>

        <div v-if="user.useCase == useCase.Work">
            <ion-select interface="popover" label="Kategorie" v-model="user.workCases">
            <ion-select-option v-for="wC in workCasesValues">
                {{ wC }}
            </ion-select-option>
        </ion-select>
        </div>

        <div v-if="user.useCase == useCase.Sport">
        <ion-select interface="popover" label="Druh" placeholder="Kategorie" v-model="user.sportCases">
            <ion-select-option v-for="sC in sportCasesValues">
                {{ sC }}
            </ion-select-option>
        </ion-select>
        </div>

        <ion-button @click="saveToDb()" >Save</ion-button>
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
import type { User } from '@/model/User';
import { reactive, ref } from 'vue';
import profilesFirebase from '@/composables/profilesFirebase'
import { routesNames } from '@/router/routesNames';

import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
  sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'



const router = useRouter()

var userID = localStorage.getItem("userID")
if (userID == null){
  userID = ""
}

const user: User = reactive({
    userId: userID,
    name: "",
    useCase: useCase.Work,
    workCases:workCases.Other,
    sportCases:SportCases.Other,
    color:colorsCases.Blue,
    groupId: ""
})

/*
onIonViewDidEnter(() => {
  clearUser()
}) */

onIonViewWillEnter(()=> {
  clearUser()
})

const loading = ref(false)

async function saveToDb() {
    loading.value = true
    clean()
    await profilesFirebase().createUser(user)
    loading.value = false
    navigateToGroupScreen()
}



function navigateToGroupScreen(){
    router.push({name: routesNames.Groups})
}

function clean(){
    if (user.useCase == useCase.Friendship){
      user.sportCases = ""
      user.workCases = ""
    }
    if (user.useCase == useCase.Relationship){
      user.sportCases = ""
      user.workCases = ""
    }
    if (user.useCase == useCase.Sport){
      user.workCases = ""
    }

    if (user.useCase == useCase.Work){
      user.sportCases = ""
    }
}

function clearUser(){
  if (userID == null){
        userID = ""
    }
    user.userId= userID,
    user.name = "",
    user.useCase= useCase.Work,
    user.workCases=workCases.Other,
    user.sportCases=SportCases.Other,
    user.color=colorsCases.Blue,
    user.groupId= ""
}


</script>

<style scoped>
</style>