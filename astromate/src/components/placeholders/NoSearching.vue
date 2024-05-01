<template>
  <div class="center ion-padding" >
    <ion-icon style="font-size:19em" src="/placeholders/no-searching.svg"></ion-icon>
    <h1 style="color: var(--ion-color-blue)">Zatím nic nehledáte</h1>
    <ion-button id="noGroups-add-group-button"  fill="outline" @click="router.push({name:routesNames.AddGroup})" class="ion-padding" shape="round">Vytvořit skupinu</ion-button>
  </div>
</template>

<script setup lang="ts">

import {routesNames} from "@/router/routesNames";
import {IonButton, IonIcon} from "@ionic/vue";
import {useRouter} from "vue-router";
const router = useRouter()
</script>

<style scoped>

</style>