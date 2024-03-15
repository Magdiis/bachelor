<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>User matching</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true" >
          <matching-card-user
              v-if="currentUser != undefined && currentProfile != undefined"
              @like="makeDecision(true,currentUser)"
              @dislike="makeDecision(false,currentUser)"
              :profile="currentProfile"
              :user="currentUser"></matching-card-user>
        </ion-content>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import {
      IonBackButton,
      IonButtons,
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      onIonViewDidEnter
    } from '@ionic/vue';
    import {useRoute, useRouter} from 'vue-router';
    import {ref} from 'vue';
    import type {User} from '@/model/User';
    import {GroupsFilter} from '@/model/GroupsFilter';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import MatchingCardUser from "@/components/MatchingCardUser.vue";
    import {Profile} from "@/model/Profile";
    import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
    import {Decision} from "@/model/Decision";
    import {Timestamp} from "firebase/firestore";
    import savingToFirestore from "@/composables/savingToFirestore";
    import updateInFirestore from "@/composables/updateInFirestore";
    import {NotificationMessage, notificationText} from "@/model/NotificationMessage";
    import {auth} from "@/firebase-service";

    const router = useRouter()
    const route = useRoute()

    const groupsFilter = ref<GroupsFilter>()

    const users =  ref<Array<User>>([])

    const currentUser = ref<User>()
    const currentProfile = ref<Profile>()

    const id = ref<string|undefined>()

    onIonViewDidEnter(async ()=>{
      id.value = auth.currentUser?.uid
      getGroupsFilterFromParams()
      await fetchOthersUsers()
    })

    function getGroupsFilterFromParams() {
        const groupsFilterParam = route.params.groupsFilter 
        groupsFilter.value = JSON.parse(groupsFilterParam.toString())
    }
    async function fetchOthersUsers() {
      // var userID = localStorage.getItem("userID")
      // if (userID == null){
      //   userID = ""
      // }
      if (groupsFilter.value != undefined){
        const usersFromFirebase = await fetchingMatchingBackend().getOtherUsers(groupsFilter.value)
        users.value = []
        users.value.push(...usersFromFirebase)
        if(users.value.length > 0){
          currentUser.value = users.value[0]
          await fetchProfile(currentUser.value?.userId)
        }

      }
    }
    async function fetchProfile(profileID: string){
      currentProfile.value = await fetchingFromFirestore().fetchProfile(profileID)
    }

    async function makeDecision(like:boolean, user:User) {
      // var userID = localStorage.getItem("userID")
      // if (userID == null){
      //   userID = ""
      // }

      // Save decision
      await saveDecisionToDB(like, user.id)
      // Make notification and send
      if(id.value != undefined && groupsFilter.value != undefined){
        await makeNotification("","","","","","")
        await makeNotification(
            id.value,
            user.userId,
            groupsFilter.value?.name,
            "name from pinia",
            groupsFilter.value?.userOrGroupID_card,
            user.id)
      }

      // Add to seen by field
      if (currentUser.value?.id != null){
        await addUsersSeenBy(currentUser.value.id)
      }

      // change current user to next one
      nextUser()
    }

    async function saveDecisionToDB(like: boolean, groupOrProfileID: string){
      const decision: Decision = {
        decidedAt: Timestamp.now(), groupOrProfileID: groupOrProfileID, like: like, id: ""
      }
      await savingToFirestore().createDecision(decision)
    }

    async function addUsersSeenBy(userId: string){
      // var userID = localStorage.getItem("userID")
      // if (userID == null){
      //   userID = ""
      // }
      if(id.value != undefined){
        await updateInFirestore().addUsersSeenBy(userId,id.value)
      }

    }

    function nextUser(){
      users.value = users.value.slice(1)
      currentUser.value =  users.value[0]
      if(currentUser.value != undefined){
        fetchProfile(currentUser.value.userId)
      }
    }

    async function makeNotification(sender:string, receiver:string,groupName: string, senderName: string,
                                    groupDocumentID:string, userDocumentID: string){
      const newNotification: NotificationMessage = {
        groupDocumentID: groupDocumentID, userDocumentID: userDocumentID,
        groupName: groupName, senderName: senderName,
        id: "", read: false, receiver: receiver,
        sender: sender, sentAt: Timestamp.now(),
        text: notificationText.UserWantsUserToHisGroup
      }
      await (savingToFirestore().createNotification(newNotification))
    }


    </script>
    
    <style scoped>
    
    </style>