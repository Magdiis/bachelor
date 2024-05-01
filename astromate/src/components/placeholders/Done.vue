<template>
  <div id="user-matching-done-placeholder" class="center ion-padding" v-if="props.userMatching">
    <ion-icon style="font-size:12em" src="/placeholders/done.svg"></ion-icon>
    <h1 style="font-weight: bold">Skupina naplněna</h1>
    <h4>Maximální počet členů byl naplněn. Pokud chcete dál hledat lidi do své skupiny, zvyšte maximální počet členů.</h4>
    <div class="ion-padding">
      <ion-button @click="navigateToEditScreen()" shape="round" style="--border-color: white; --color: white" fill="outline" >
        Zvýšit počet
      </ion-button>
    </div>
  </div>
  <div id="group-matching-done-placeholder" class="center ion-padding" v-else>
    <ion-icon style="font-size:12em" src="/placeholders/done.svg"></ion-icon>
    <h1 style="font-weight: bold">Skupina nalezena</h1>
    <h4>Jste členem skupiny ‘{{globalSelectedSearchedGroup.groupName}}’.
      Jestli chcete hledat další skupinu v této kategorii, definujte si novou hledanou skupinu. </h4>
    <div class="ion-padding">
      <ion-button @click="navigateToCreateSearchedGroup()" shape="round" style="--border-color: white; --color: white" fill="outline" >
        Vytvořit
      </ion-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {IonIcon, IonCol, IonRow, IonButton} from "@ionic/vue";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {Group} from "@/model/group/Group";
import {globalGroupEditing, globalSelectedGroup, globalSelectedSearchedGroup} from "@/composables/store/useGroupStore";

const props = defineProps<{
  userMatching: boolean
}>()

const navigateToEditScreen = () => {
  Object.assign(globalGroupEditing, globalSelectedGroup)
  router.push({name:routesNames.SearchPeopleEdit})
}

const navigateToCreateSearchedGroup = ()=>{
  router.push({name:routesNames.SearchGroupsAdd})
}

const router= useRouter()

</script>

<style scoped>


</style>