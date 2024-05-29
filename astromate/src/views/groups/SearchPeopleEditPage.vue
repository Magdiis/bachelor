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

      <div class="ion-padding">
        <ion-input label="Jméno skupiny" fill="outline" label-placement="floating" v-model="globalGroupEditing.name" error-text="Špatný nazev"
                   :counter="true" maxlength="20"
                   :helper-text="isInputEmpty.name ? 'povinné': '' " class="custom"
        ></ion-input>
      </div>

      <div class="ion-padding-horizontal custom">
        <ion-textarea class="custom" label="Popis" label-placement="floating"
                      :helper-text="isInputEmpty.description ? 'povinné': '' "
                      :counter="true" maxlength="200"
                      v-model="globalGroupEditing.description" fill="outline" rows="3">
        </ion-textarea>
      </div>



      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Barevný motiv"  v-model="globalGroupEditing.color">
          <ion-select-option v-for="color in colorsCasesValues">
            {{ color }}
          </ion-select-option>
        </ion-select>
      </div>

      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Počet členů" placeholder="2" v-model="globalGroupEditing.maxMembers">
          <ion-select-option v-for="n in rangeNumbers">
            {{ n }}
          </ion-select-option>
        </ion-select>
      </div>
      
      <!--TODO: když bude čas tak upravit ale jinak na to kašlat -->
<!--      <div class="ion-padding-horizontal ion-padding-top">-->
<!--      <ion-select interface="popover" label="Účel" placeholder="Práce" v-model="globalGroupEditing.useCase">-->
<!--        <ion-select-option v-for="uC in useCasesValues">-->
<!--          {{ uC }}-->
<!--        </ion-select-option>-->
<!--      </ion-select>-->
<!--      </div>-->


<!--      <div class="ion-padding-horizontal ion-padding-top"  v-if="globalGroupEditing.useCase == useCase.Work">-->
<!--        <ion-select interface="popover" label="Kategorie" v-model="globalGroupEditing.workCase">-->
<!--          <ion-select-option v-for="wC in workCasesValues">-->
<!--            {{ wC }}-->
<!--          </ion-select-option>-->
<!--        </ion-select>-->
<!--      </div>-->

<!--      <div class="ion-padding-horizontal ion-padding-top"  v-if="globalGroupEditing.useCase == useCase.Sport">-->
<!--        <ion-select interface="popover" label="Druh" placeholder="Kategorie" v-model="globalGroupEditing.sportCase">-->
<!--          <ion-select-option v-for="sC in sportCasesValues">-->
<!--            {{ sC }}-->
<!--          </ion-select-option>-->
<!--        </ion-select>-->
<!--      </div>-->

      <ion-button expand="block" shape="round" class="ion-padding" @click="update()">Uložit změny</ion-button>
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
  globalSearchedGroups,
  globalSelectedGroup
} from "@/composables/store/useGroupStore";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon, IonInput,
  IonLoading,
  IonPage, IonSelect, IonSelectOption, IonTextarea,
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
import {reactive, ref} from "vue";
import updateInFirestore from "@/composables/updateInFirestore";
import {currentGroupChat} from "@/composables/store/useGroupChatStore";
import {useOwnGroupStore} from "@/composables/store/useOwnGroupStore";

const router = useRouter()
const updateFirestore = updateInFirestore()
const onwGroupStore = useOwnGroupStore()

const loading = ref(false)

const isInputEmpty = reactive({
  name: false,
  description: false
})


onIonViewWillEnter(()=>{
  setOtherValueToCategories()
})



const rangeNumbers: number[] = []

for (let i = globalGroupEditing.currentMembers; i <= 30; i++) {
  if(i>1){
    rangeNumbers.push(i)
  }
}

async function update(){
  if(validate()){
    loading.value = true
    await updateFirestore.updateGroup(globalGroupEditing)
    Object.assign(globalSelectedGroup, globalGroupEditing)
    await updateFirestore.updateColorAndNameInGroupChat(globalGroupEditing.color,globalGroupEditing.name, globalGroupEditing.id)
    currentGroupChat.color = globalGroupEditing.color
    currentGroupChat.name = globalGroupEditing.name

    onwGroupStore.changeOwnGroupAfterEdit(globalGroupEditing.id, globalGroupEditing)
    router.back()
    loading.value = false
  }
}

function validate(): boolean{
  isInputEmpty.description = globalGroupEditing.description.length < 1
  isInputEmpty.name = globalGroupEditing.name.length < 1
  return  !isInputEmpty.name && !isInputEmpty.description
}

function setOtherValueToCategories() {
  if (globalGroupEditing.useCase === useCase.Friendship || globalGroupEditing.useCase === useCase.Relationship){
    globalGroupEditing.sportCase = SportCases.Other
    globalGroupEditing.workCase =  workCases.Other
  }
  else if (globalGroupEditing.useCase === useCase.Work){
     globalGroupEditing.sportCase = SportCases.Other
  }
  else if (globalGroupEditing.useCase === useCase.Sport){
    globalGroupEditing.workCase = workCases.Other
  }
}

</script>


<style scoped>

</style>