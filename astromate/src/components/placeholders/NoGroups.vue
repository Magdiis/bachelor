<template>
  <div class="center ion-padding" >
    <ion-icon style="font-size:19em" src="/placeholders/no-groups.svg"></ion-icon>
    <h1 style="color: var(--ion-color-blue)">Žádné vytvořené skupiny</h1>
    <ion-button id="noGroups-add-group-button"  fill="outline" @click="router.push({name:routesNames.AddGroup})" class="ion-padding" shape="round">Vytvořit skupinu</ion-button>
  </div>

</template>

<script setup lang="ts">

import {IonIcon, IonButton} from "@ionic/vue";
import {useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
const router = useRouter()
</script>

<style scoped>

</style>