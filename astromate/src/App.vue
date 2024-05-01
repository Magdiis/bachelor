<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {Timestamp} from "firebase/firestore";
import {getDegree} from "@/composables/empheremis/degreeConvertor";
import {useCompatibility, userPlanets} from "@/composables/empheremis/useCompatibility";


</script>
