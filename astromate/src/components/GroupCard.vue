<!--
router.push('/groupMatching/someString')
-->
<template>
  <ion-card @click="router.push({name: routesNames.GroupMatching, params:{group:groupJSON}}) " >
    <ion-card-header>
        <ion-card-title>
            {{ props.group.name }}
        </ion-card-title>
    </ion-card-header>
    <ion-card-content>
        {{ group.workCases }}

    </ion-card-content>
  </ion-card>

</template>


<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, onIonViewDidEnter } from '@ionic/vue';
import type { Group } from '@/model/Group';
import { routesNames } from '@/router/routesNames';
import { useRouter } from 'vue-router';
import {onMounted} from "vue"
import { SportCases, workCases } from '@/model/createGroupEnums';

const router = useRouter()

const props = defineProps<{
  group: Group
}>()


// cely objekt .. parsovani
var groupJSON: string = ""


onMounted(()=>{
    groupJSON = JSON.stringify(props.group)
})

</script>


<style scoped>

</style>