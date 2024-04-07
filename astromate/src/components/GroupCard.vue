<!--
router.push('/groupMatching/someString')
-->
<template>
  <ion-card @click="router.push({name: routesNames.UserMatching, params:{groupsFilter:groupsFilterString}}) " >
    <ion-card-header>
        <ion-card-title>
            {{ props.group.name }}
        </ion-card-title>
    </ion-card-header>
    <ion-card-content>
        {{ group.description }}
    </ion-card-content>
  </ion-card>

</template>


<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, onIonViewDidEnter } from '@ionic/vue';
import type { Group } from '@/model/group/Group';
import { routesNames } from '@/router/routesNames';
import { useRouter } from 'vue-router';
import {onMounted} from "vue"
import { SportCases, workCases } from '@/model/group/createGroupEnums';
import { GroupsFilter } from '@/model/group/GroupsFilter';
import { returnCategory } from '@/composables/categoryConvertor';

const router = useRouter()

const props = defineProps<{
  group: Group
}>()


// cely objekt .. parsovani
var groupsFilterString: string = ""


onMounted(()=>{
  var groupsFilter: GroupsFilter = {
    userId: props.group.userId,
    useCase: props.group.useCase,
    category: returnCategory(props.group.useCase,props.group.workCase, props.group.sportCase),
    name: props.group.name,
    userOrGroupID_card: props.group.id
  }
  groupsFilterString = JSON.stringify(groupsFilter)
})

</script>


<style scoped>

</style>