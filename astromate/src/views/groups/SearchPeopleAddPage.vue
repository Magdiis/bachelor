<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Hledám lidi</ion-title>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

        <ion-input placeholder="Jméno" v-model="group.name"></ion-input>
        <ion-select interface="popover" label="Barva"  v-model="group.color">
            <ion-select-option v-for="color in colorsCasesValues">
                {{ color }}
            </ion-select-option>
        </ion-select>

      <ion-select interface="popover" label="Počet členů" placeholder="2" v-model="group.maxMembers">
            <ion-select-option v-for="n in rangeNumbers">
                {{ n }}
            </ion-select-option>
        </ion-select>

        <ion-textarea label="Popis" label-placement="floating" v-model="group.description" fill="outline" rows="3"></ion-textarea>
        
        <ion-select interface="popover" label="Účel" placeholder="Práce" v-model="group.useCase">
            <ion-select-option v-for="uC in useCasesValues">
                {{ uC }}
            </ion-select-option>
        </ion-select>

        <div v-if="group.useCase == useCase.Work">
            <ion-select interface="popover" label="Kategorie" v-model="group.workCase">
            <ion-select-option v-for="wC in workCasesValues">
                {{ wC }}
            </ion-select-option>
        </ion-select>
        </div>

        <div v-if="group.useCase == useCase.Sport">
        <ion-select interface="popover" label="Druh" placeholder="Kategorie" v-model="group.sportCase">
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
import type { Group } from '@/model/Group';
import { reactive, ref } from 'vue';
import savingToFirestore from '@/composables/savingToFirestore'
import { routesNames } from '@/router/routesNames';

import {onUnmounted} from 'vue'
import {useCase, useCasesValues, workCases, workCasesValues, SportCases, sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'
import {auth} from "@/firebase-service";

const router = useRouter()

/*const delay = ms => new Promise(res => setTimeout(res, ms));

async function waitAndSetfalse(){
  loading.value = true
  await delay(2000);
  loading.value = false
} */


const group: Group = reactive({
    id: "", 
    userId: "",
    name:"",
    maxMembers: 2,
    currentMembers: 1,
    description: "",
    useCase: useCase.Work,
    workCase: workCases.Other,
    sportCase: SportCases.Other,
    membersIDs: [] ,
    color: colorsCases.Blue
})

// ukaze se page a pak az se provede
/*onIonViewDidEnter(() => { 
    clearGroup()
}) */

onIonViewWillEnter(()=>{
    clearGroup()
  if(auth.currentUser != null){
    group.userId = auth.currentUser.uid
    group.membersIDs.push(auth.currentUser.uid)
  }

})


const rangeNumbers: number[] = []

for (let i = 2; i <= 30; i++) {
    rangeNumbers.push(i)
}

const loading = ref(false)

async function saveToDb() {
    loading.value = true
    clean()
    await savingToFirestore().createGroup(group)
    loading.value = false
    navigateToGroupScreen()
}

function navigateToGroupScreen(){
    router.push({name: routesNames.Groups})
}

function clean(){
    if (group.useCase == useCase.Friendship){
        group.sportCase = ""
        group.workCase = ""
    }
    if (group.useCase == useCase.Relationship){
        group.sportCase = ""
        group.workCase = ""
    }
    if (group.useCase == useCase.Sport){
        group.workCase = ""
    }

    if (group.useCase == useCase.Work){
        group.sportCase = ""
    }
}

function clearGroup(){
    group.userId = "",
    group.name = "",
    group.maxMembers = 2,
    group.currentMembers = 1,
    group.description = "",
    group.useCase = useCase.Work,
    group.workCase = workCases.Other,
    group.sportCase = SportCases.Other,
    group.membersIDs = [],
    group.color = colorsCases.Blue
}
// function loadUserID(): string {
//   const userID = localStorage.getItem("userID")
//   if(userID == null){
//     return ""
//   } else {
//     return userID
//   }
// }

</script>

<style scoped>
</style>