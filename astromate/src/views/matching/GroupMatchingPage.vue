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
            v-if="currentGroup!=undefined && currentMembers.length>0"
            :group="currentGroup"
            :profiles="currentMembers">
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
    import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
    import {Profile} from "@/model/Profile";
    
    const router = useRouter()
    const route = useRoute()

    const groups = ref<Array<Group>>([])
    
    const groupsFilter = ref<GroupsFilter>()

    const currentGroup = ref<Group>()

    const currentMembers = ref<Array<Profile>>([])

    const isEmpty = ref(false) // for placeholder 
    

    onIonViewDidEnter(async()=>{
        getGroupsFilterFromParams()
        await fetchOthersGroups()
        //currrentGroup.value = groups.value[0]
        //nextGroup.value = groups.value[1]
    })

    async function fetchOthersGroups() {
        var userID = localStorage.getItem("userID")
        if (userID == null){
            userID = ""
        }
        if (groupsFilter.value != undefined){
          const groupsFromFirebase = await fetchingMatchingBackend().getOtherGroups(groupsFilter.value)
          console.log("fetched groups: " )
          groupsFromFirebase.forEach((g)=>{
            console.log(g)
          })
          groups.value = []
          groups.value.push(...groupsFromFirebase)
          if(groups.value.length > 0){
            currentGroup.value = groups.value[0]
            console.log("current group value name "+currentGroup.value?.name)
            await fetchMembers(currentGroup.value?.membersIDs)
          }

        }

    }

    async function fetchMembers(membersIDs: string[]){
        const profilesFromFirebase = await fetchingFromFirestore().fetchMembersProfiles(membersIDs)
        currentMembers.value.push(...profilesFromFirebase)
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

      // Add to seen by field
      if (currentGroup.value?.id != null){
        await addGroupsSeenBy(currentGroup.value.id)
      }
      // change current group to next one and remove
      nextGroup()

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
      if(currentGroup.value != undefined){
        fetchMembers(currentGroup.value?.membersIDs)
      }
    }

    async function addGroupsSeenBy(groupID: string){
      var userID = localStorage.getItem("userID")
      if (userID == null){
        userID = ""
      }
        await updateInFirestore().addGroupsSeenBy(groupID,userID)
    }

    </script>
    
    <style scoped>

    </style>