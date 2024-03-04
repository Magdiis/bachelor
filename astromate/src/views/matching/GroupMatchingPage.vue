<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>Group matching</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true">
        <matching-card-group
            @like="makeDecision(true, currentGroup)"
            @dislike="makeDecision(false, currentGroup)"
            v-if="currentGroup!=undefined"
            :group="currentGroup">
        </matching-card-group>
        </ion-content>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import { IonPage, IonContent, IonTitle, 
    IonHeader, IonToolbar,IonButtons, IonBackButton, 
    IonButton, IonRow, IonCol, IonGrid, onIonViewDidEnter} from '@ionic/vue';
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import type { Group } from '@/model/Group';
    import { ref, reactive } from 'vue';
import { SportCases, useCase, workCases } from '@/model/createGroupEnums';
import { closeOutline } from 'ionicons/icons';
import {returnCategory} from '@/composables/categoryConvertor'
import { GroupsFilter } from '@/model/GroupsFilter';
import  MatchingCardGroup from '@/components/MatchingCardGroup.vue'
    import savingToFirestore from "@/composables/savingToFirestore";
    import {Decision} from "@/model/Decision";
    import {Timestamp} from "firebase/firestore";
    import updateInFirestore from "@/composables/updateInFirestore";
    
    const router = useRouter()
    const route = useRoute()

    const groups = ref<Array<Group>>([])
    
    const currentGroup = ref<Group>()
    

    onIonViewDidEnter(async()=>{
        getGroupFromParams()
        fetchOthersGroups()
    })

    async function fetchOthersGroups() {
        var userID = localStorage.getItem("userID")
        if (userID == null){
            userID = ""
        }
        if (currentGroup.value != undefined) {
            const groupsFromFirebase = await fetchingFromFirestore().getOthersGroups(
                userID, currentGroup.value.useCase, currentGroup.value.workCase, 
                currentGroup.value.sportCase)
                groups.value = []
                groups.value = groupsFromFirebase
                groups.value.forEach(group => {
                    console.log(group + "\n")
                });
        }
        
    }



    function getGroupsFilterFromParams() {
        const groupsFilterParam = route.params.groupsFilter 
        groupsFilter.value = JSON.parse(groupsFilterParam.toString())
        console.log("groups filter: "+ groupsFilter.value?.useCase + groupsFilter.value?.category+ " "+groupsFilter.value?.userId)
    }

    async function makeDecision(like:boolean, group: Group){
      console.log(like)
      // Save decision
      await saveDecisionToDB(like, group.id)
      // Make notification and send

      // Add to seen groups field
      if (currentGroup.value?.id != null){
        await addToSeenGroups(currentGroup.value.id)
      }
      // change current group to next one
      nextGroup()
      // remove from group from groups
    }

    async function saveDecisionToDB(like: boolean, groupOrProfileID: string){
      const decision: Decision = {
        decidedAt: Timestamp.now(), groupOrProfileID: groupOrProfileID, like: like, id: ""
      }
      await savingToFirestore().createDecision(decision)
    }

    function nextGroup(){
     // groups.value.shift()  //remove first element
      groups.value = groups.value.slice(1)
      currentGroup.value = groups.value[0]
    }

    async function addToSeenGroups(groupID: string){
      var userID = localStorage.getItem("userID")
      if (userID == null){
        userID = ""
      }
        await updateInFirestore().addToSeenGroups(userID,groupID)
    }
    </script>
    
    <style scoped>
    
    </style>