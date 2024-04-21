<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Upravit</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-select interface="popover" label="Barva"  v-model="globalSearchedGroupEditing.color">
        <ion-select-option v-for="color in colorsCasesValues">
          {{ color }}
        </ion-select-option>
      </ion-select>

      <ion-select interface="popover" label="Účel" placeholder="Práce" v-model="globalSearchedGroupEditing.useCase">
        <ion-select-option v-for="uC in useCasesValues">
          {{ uC }}
        </ion-select-option>
      </ion-select>

      <div v-if="globalSearchedGroupEditing.useCase == useCase.Work">
        <ion-select interface="popover" label="Kategorie" v-model="globalSearchedGroupEditing.workCase">
          <ion-select-option v-for="wC in workCasesValues">
            {{ wC }}
          </ion-select-option>
        </ion-select>
      </div>

      <div v-if="globalSearchedGroupEditing.useCase == useCase.Sport">
        <ion-select interface="popover" label="Druh" placeholder="Kategorie" v-model="globalSearchedGroupEditing.sportCase">
          <ion-select-option v-for="sC in sportCasesValues">
            {{ sC }}
          </ion-select-option>
        </ion-select>
      </div>

      <ion-button @click="update()" >Uložit</ion-button>
      <ion-loading :is-open="loading" message="Ukládání" spinner="lines-small" ></ion-loading>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {routesNames} from "@/router/routesNames";
import {add} from "ionicons/icons";
import {
  globalGroupEditing,
  globalGroups,
  globalSearchedGroupEditing,
  globalSearchedGroups, globalSelectedGroup, globalSelectedSearchedGroup
} from "@/composables/store/useGroupStore";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon, IonInput,
  IonLoading,
  IonPage, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar, onIonViewWillEnter
} from "@ionic/vue";
import {useRouter} from "vue-router";
import {
  colorsCasesValues, SportCases,
  sportCasesValues,
  useCase,
  useCasesValues, workCases,
  workCasesValues
} from "@/model/group/createGroupEnums";
import {ref} from "vue";
import updateInFirestore from "@/composables/updateInFirestore";

const router = useRouter()
const updateFirestore = updateInFirestore()


const loading = ref(false)

console.log("search groups edit page. Editing ", globalSearchedGroupEditing)

onIonViewWillEnter(()=>{
  setOtherValueToCategories()
})

async function update(){
  loading.value = true
  await updateFirestore.updateSearchedGroup(globalSearchedGroupEditing)
  Object.assign(globalSelectedSearchedGroup, globalSearchedGroupEditing)
  console.log("editing Page, setting selected global group for editing: ",globalSelectedSearchedGroup)
  router.back()
  loading.value = false
}

function setOtherValueToCategories() {
  if (globalSearchedGroupEditing.useCase === useCase.Friendship || globalSearchedGroupEditing.useCase === useCase.Relationship){
    globalSearchedGroupEditing.sportCase = SportCases.Other
    globalSearchedGroupEditing.workCase =  workCases.Other
  }
  else if (globalSearchedGroupEditing.useCase === useCase.Work){
    globalSearchedGroupEditing.sportCase = SportCases.Other
  }
  else if (globalSearchedGroupEditing.useCase === useCase.Sport){
    globalSearchedGroupEditing.workCase = workCases.Other
  }
}
</script>


<style scoped>

</style>