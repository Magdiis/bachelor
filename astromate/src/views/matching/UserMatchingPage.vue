<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>

        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>

        <ion-buttons slot="primary">
          <ion-button id="popover-edit-group">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Hledání uživatelů</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true" :class="contentColor">
          <ion-popover trigger="popover-edit-group" size="auto" :dismiss-on-select="true">
            <ion-content>
              <ion-list lines="none">
                <ion-item :button="true" @click="navigateToEditPage()">
                  <ion-icon size="large" :icon="pencilOutline" class="ion-padding-end"></ion-icon>
                  Upravit
                </ion-item>
                <ion-item :button="true" id="present-alert-delete-group">
                  <ion-icon size="large" :icon="trashOutline" class="ion-padding-end"></ion-icon>
                  Smazat
                </ion-item>
              </ion-list>
              <ion-alert
                  trigger="present-alert-delete-group"
                  header="Opravdu chcete smazat vyhledávání uživatelů? Bude smazán i  případný chat."
                  :buttons="cancelOrConfirmButtons"
              >
              </ion-alert>
            </ion-content>
          </ion-popover>

          <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>
          <no-available v-if="isEmpty" :color="globalSelectedGroup.color" :no-groups-available="false"></no-available>
          <matching-card-user
              v-if="currentUser != undefined && currentProfile != undefined && currentProfilePhotoUrl!=undefined"
              @like="makeDecision(true,currentUser)"
              @dislike="makeDecision(false,currentUser)"
              :profile="currentProfile"
              :user="currentUser"
              :url="currentProfilePhotoUrl"
              :color="globalSelectedGroup.color">

          </matching-card-user>



        </ion-content>

    </ion-page>
    </template>
    
    <script setup lang="ts">
    import {
      IonAlert,

      IonBackButton, IonButton,
      IonButtons,
      IonContent,
      IonHeader, IonIcon, IonItem, IonList, IonLoading,
      IonPage, IonPopover,
      IonTitle,
      IonToolbar,
      onIonViewDidEnter, onIonViewDidLeave, onIonViewWillEnter
    } from '@ionic/vue';
    import {useRoute, useRouter} from 'vue-router';
    import {computed, ref} from 'vue';
    import type {User} from '@/model/group/User';
    import {GroupsFilter} from '@/model/group/GroupsFilter';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import MatchingCardUser from "@/components/MatchingCardUser.vue";
    import {Profile} from "@/model/profile/Profile";
    import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
    import {Decision} from "@/model/Decision";
    import {Timestamp} from "firebase/firestore";
    import savingToFirestore from "@/composables/savingToFirestore";
    import updateInFirestore from "@/composables/updateInFirestore";
    import {NotificationMessage, notificationText} from "@/model/notification/NotificationMessage";
    import {auth} from "@/firebase-service";
    import {globalProfile} from "@/composables/store/profileStore";
    import {ellipsisHorizontal, ellipsisVertical, pencilOutline, trashOutline} from "ionicons/icons";
    import deletingInFirestore from "@/composables/deletingInForestore";
    import {routesNames} from "@/router/routesNames";
    import {
      globalGroupEditing,
      globalSelectedGroup,
      useGroupStore
    } from "@/composables/store/useGroupStore";
    import {returnCategory} from "@/composables/categoryConvertor";
    import NoAvailable from "@/components/placeholders/NoAvailable.vue";
    import {colorsCases} from "@/model/group/createGroupEnums";
    import useStorage from "@/composables/firebaseStorage/useStorage";

    const router = useRouter()
    const route = useRoute()
    const deleteFirestore = deletingInFirestore()
    const updateFirestore = updateInFirestore()
    const groupStore = useGroupStore()
    const firebaseStorage = useStorage()

    const isEmpty = ref(false) // for placeholder

    const loading = ref(false)

    const groupsFilter = ref<GroupsFilter>()

    const users =  ref<Array<User>>([])

    const currentUser = ref<User>()
    const currentProfile = ref<Profile>()
    const currentProfilePhotoUrl = ref<string>("")

    onIonViewWillEnter(async ()=>{
      console.log("global selected group: ", globalSelectedGroup)
      getGroupsFilter()
      console.log(groupsFilter.value?.userOrGroupID_card)
      await fetchOthersUsers()
    })

    onIonViewDidLeave(()=>{
      isEmpty.value = false
    })
    function getGroupsFilter() {
        groupsFilter.value = {
          category: returnCategory(globalSelectedGroup.useCase,
              globalSelectedGroup.workCase, globalSelectedGroup.sportCase),
          name: globalSelectedGroup.name,
          useCase: globalSelectedGroup.useCase,
          userId: globalSelectedGroup.userId, userOrGroupID_card: globalSelectedGroup.id
        }
        console.log("user matching page, filter:  ", JSON.stringify(groupsFilter._value,null,2) )
      console.log("user matching page, global group:  ", JSON.stringify(globalSelectedGroup._value,null,2) )
    }
    async function fetchOthersUsers() {
      if (groupsFilter.value != undefined){
        loading.value = true
        const usersFromFirebase = await fetchingMatchingBackend().getOtherUsers(groupsFilter.value)
        users.value = []
        users.value.push(...usersFromFirebase)
        if(users.value.length > 0){
          currentUser.value = users.value[0]
          await fetchProfile(currentUser.value?.userId)

          loading.value = false
        } else {
          loading.value = false
          isEmpty.value = true
        }

      }
    }
    async function fetchProfile(profileID: string){
      currentProfile.value = await fetchingFromFirestore().fetchProfile(profileID)
      if(currentProfile.value != undefined){
        const responseStorage = await firebaseStorage.getPhoto(currentProfile.value.id)
        if(responseStorage.URL != undefined){
          currentProfilePhotoUrl.value = responseStorage.URL
        } else if(responseStorage.error != undefined){
          currentProfilePhotoUrl.value = 'error'
        }
      }
    }

    async function makeDecision(like:boolean, user:User) {
      // Save decision
      await saveDecisionToDB(like, user.id)
      // Make notification and send
      if(groupsFilter.value != undefined){
        await makeNotification("","","","","","")
        await makeNotification(
            globalProfile.id,
            user.userId,
            groupsFilter.value?.name,
            globalProfile.name,
            groupsFilter.value?.userOrGroupID_card,
            user.id)
      }

      // Add to seen by field
      if (currentUser.value?.id != null){
        await addUsersSeenBy(currentUser.value.id)
      }

      // change current user to next one
      await nextUser()
    }

    async function saveDecisionToDB(like: boolean, groupOrProfileID: string){
      const decision: Decision = {
        decidedAt: Timestamp.now(), groupOrProfileID: groupOrProfileID, like: like, id: ""
      }
      await savingToFirestore().createDecision(decision)
    }

    async function addUsersSeenBy(userId: string){
        await updateInFirestore().addUsersSeenBy(userId,globalProfile.id)
    }

    async function nextUser(){
      users.value = users.value.slice(1)
      currentUser.value =  users.value[0]
      if(currentUser.value != undefined){
        await fetchProfile(currentUser.value.userId)
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

    async function deleteOwnGroup(groupId: string){
      loading.value = true
      console.log("deleting group with id ", groupId)
        // DELETE GROUP
        // DELETE GROUP CHAT ?? -> DELETE MESSAGES AND GROUP CHAT
      await deleteFirestore.deleteGroup(groupId)

      // SET "" TO SEARCHED GROUPS WITH GROUP ID
      await updateFirestore.setGroupIdEmptyInGroups(groupId)
      // SEND NOTIFICATION TO MEMBERS

      // NAVIGATE
      await router.push({name: routesNames.Groups})
      loading.value = false
    }

    function sendNotification(membersIds: string[]){

    }

    function navigateToEditPage(){
        groupStore.setEditingGroup(globalSelectedGroup)
        console.log("userMatchingPage setting editingGroup: ", JSON.stringify(globalGroupEditing,null, 2))
        router.push({name:routesNames.SearchPeopleEdit})
    }


    // ALERT BUTTONS
    const cancelOrConfirmButtons = [
      {
        text: 'Zrušit',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Smazat',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        handler: async () => {
          if(groupsFilter.value?.userOrGroupID_card != undefined){
            await deleteOwnGroup(groupsFilter.value.userOrGroupID_card)
          }
        },
      },
    ];

    // CSS CLASS
    const contentColor = computed(()=>{
      switch (globalSelectedGroup.color) {
        case colorsCases.Blue:
          return 'ion-content-blue'
        case colorsCases.Green:
          return 'ion-content-green'
        case colorsCases.Red:
          return 'ion-content-red'
        case colorsCases.Orange:
          return 'ion-content-orange'
      }
    })
    </script>
    
    <style scoped>
    .ion-content-green {
      --ion-background-color:var(--ion-color-green);
      --color: white
    }

    .ion-content-blue {
      --ion-background-color:var(--ion-color-blue);
      --color: white
    }
    .ion-content-red {
      --ion-background-color:var(--ion-color-darkRed);
      --color: white
    }
    .ion-content-orange {
      --ion-background-color:var(--ion-color-orange);
      --color: white
    }


    
    </style>