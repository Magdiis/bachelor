<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {getJupiterEphemeris, getSunEphemeris} from "@/composables/empheremis/useEmpheremis";
import {Timestamp} from "firebase/firestore";
import {getDegree} from "@/composables/empheremis/degreeConvertor";

</script>
