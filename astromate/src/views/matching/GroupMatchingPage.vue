<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button id="popover-edit-searched-group">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Hledání skupin</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true">
          <ion-popover trigger="popover-edit-searched-group" size="auto" :dismiss-on-select="true">
            <ion-content>
              <ion-list lines="none">
                <ion-item :button="true" @click="navigateToEditPage()">
                  <ion-icon size="large" :icon="pencilOutline" class="ion-padding-end"></ion-icon>
                  Upravit
                </ion-item>
                <ion-item :button="true" id="present-alert-delete-searched-group">
                  <ion-icon size="large" :icon="trashOutline" class="ion-padding-end"></ion-icon>
                  Smazat
                </ion-item>
              </ion-list>
              <ion-alert
                  trigger="present-alert-delete-searched-group"
                  header="Opravdu chcete smazat vyhledávání skupin?"
                  :buttons="cancelOrConfirmButtons"
              >
              </ion-alert>
            </ion-content>
          </ion-popover>

        <matching-card-group
            @like="makeDecision(true, currentGroup)"
            @dislike="makeDecision(false, currentGroup)"
            v-if="currentGroup!=undefined && currentMembers.length>0"
            :group="currentGroup"
            :profiles="currentMembers">
        </matching-card-group>


          <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>
          <no-available v-if="isEmpty" :no-groups-available="true"></no-available>

        </ion-content>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import {
      IonPage,
      IonContent,
      IonTitle,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonBackButton,
      IonButton,
      IonRow,
      IonCol,
      IonGrid,
      onIonViewDidEnter,
      onIonViewWillEnter,
      IonIcon,
      IonList,
      IonItem,
      IonPopover,
      IonAlert, IonLoading
    } from '@ionic/vue';
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import type { Group } from '@/model/group/Group';
    import { ref, reactive } from 'vue';
import { SportCases, useCase, workCases } from '@/model/group/createGroupEnums';
    import {closeOutline, ellipsisHorizontal, ellipsisVertical, logOutOutline, pencilOutline, trashOutline} from 'ionicons/icons';
import {returnCategory} from '@/composables/categoryConvertor'
import { GroupsFilter } from '@/model/group/GroupsFilter';
import  MatchingCardGroup from '@/components/MatchingCardGroup.vue'
    import savingToFirestore from "@/composables/savingToFirestore";
    import {Decision} from "@/model/Decision";
    import {Timestamp} from "firebase/firestore";
    import updateInFirestore from "@/composables/updateInFirestore";
    import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
    import {Profile} from "@/model/profile/Profile";
    import {NotificationMessage, notificationText} from "@/model/notification/NotificationMessage";
    import {auth} from "@/firebase-service";
    import {globalProfile} from "@/composables/store/profileStore";
    import {globalSelectedSearchedGroup, useGroupStore} from "@/composables/store/useGroupStore";
    import {routesNames} from "@/router/routesNames";
    import deletingInFirestore from "@/composables/deletingInForestore";
    import {User} from "@/model/group/User";
    import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
    import {GroupChat} from "@/model/chat/Chat";
    import NoAvailable from "@/components/placeholders/NoAvailable.vue";
    
    const router = useRouter()
    const route = useRoute()
    const groupStore = useGroupStore()
    const groupChatStore = useGroupChatStore()
    const deleteFirestore = deletingInFirestore()
    const updateFirestore = updateInFirestore()

    const groups = ref<Array<Group>>([])
    
    const groupsFilter = ref<GroupsFilter>()

    const currentGroup = ref<Group>()

    const currentMembers = ref<Array<Profile>>([])

    const isEmpty = ref(false) // for placeholder

    const loading = ref(false)

    onIonViewDidEnter(async()=>{
      getGroupsFilter()
      await fetchOthersGroups()
    })

    async function fetchOthersGroups() {
        if (groupsFilter.value != undefined){
          loading.value = true
          const groupsFromFirebase = await (fetchingMatchingBackend().getOtherGroups(groupsFilter.value))
          groups.value = []
          groups.value.push(...groupsFromFirebase)
          if(groups.value.length > 0) {
            currentGroup.value = groups.value[0]
            await fetchMembers(currentGroup.value?.membersIDs)
            loading.value = false
          } else {
            console.log("I am here, loading false, is empty true")
            loading.value = false
            isEmpty.value = true
          }
        }
    }

    async function fetchMembers(membersIDs: string[]){
        const profilesFromFirebase = await (fetchingFromFirestore().fetchMembersProfiles(membersIDs))
        currentMembers.value.push(...profilesFromFirebase)
    }



    function getGroupsFilter() {
        groupsFilter.value = {
          category: returnCategory(globalSelectedSearchedGroup.useCase,globalSelectedSearchedGroup.workCase,globalSelectedSearchedGroup.sportCase),
          name: globalSelectedSearchedGroup.name,
          useCase: globalSelectedSearchedGroup.useCase,
          userId: globalSelectedSearchedGroup.userId,
          userOrGroupID_card: globalSelectedSearchedGroup.id
        }
    }

    async function makeDecision(like:boolean, group: Group){
      console.log(like)
      // Save decision
      await saveDecisionToDB(like, group.id)
      // Make notification and send
      if(groupsFilter.value != undefined){
        await makeNotification(
            globalProfile.id,
            group.userId,
            group.name,
            globalProfile.name,
            group.id,
            groupsFilter.value?.userOrGroupID_card)

      }

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
        await updateFirestore.addGroupsSeenBy(groupID,globalProfile.id)

    }

    async function makeNotification(sender:string, receiver:string, groupName: string,
                                    senderName: string,groupDocumentID:string, userDocumentID: string){
      const newNotification: NotificationMessage = {
        groupDocumentID: groupDocumentID, userDocumentID: userDocumentID,
        groupName: groupName, senderName: senderName,
        id: "", read: false, receiver: receiver,
        sender: sender, sentAt: Timestamp.now(),
        text: notificationText.UserWantsToUsersGroup
      }
      await (savingToFirestore().createNotification(newNotification))
    }


    // EDITING
    async function deleteOwnSearchedGroup(searchedGroup: User){
      loading.value = true
      // DELETE SEARCHED GROUP
      await deleteFirestore.deleteSearchedGroup(searchedGroup.id)
      if(searchedGroup.groupId != ""){
        // LEAVE GROUP (REMOVE MEMBER FROM LIST)
        await updateFirestore.removeFromGroup(searchedGroup.groupId, globalProfile.id)

        // LEAVE GROUP CHAT
        const groupChat = groupChatStore.getGroupChat(searchedGroup.groupId)
        const updatedGroupChat = leaveGroupChat(groupChat)
        await updateFirestore.leaveGroupChat(updatedGroupChat)

        // NOTIFICATION?

      }
      // NAVIGATE
      loading.value = false
      router.back()
    }

    function navigateToEditPage(){
      groupStore.setEditingSearchedGroup(globalSelectedSearchedGroup)
      router.push({name:routesNames.SearchGroupsEdit})
    }

    function leaveGroupChat(groupChat: GroupChat): GroupChat {
      const updatedMembersIds = groupChat.membersIDs.filter((g) => {
        return g !== globalProfile.id
      })
      const updatedNames = groupChat.membersNames.filter((n) => {
        return n !== globalProfile.name
      })

      const updatedMembersNamesAndIDs = groupChat.membersNamesAndIDs.filter((m) => {
        return !m.includes(globalProfile.name + ";" + globalProfile.id)
      })
      return {
        color: groupChat.color,
        countMembers: updatedMembersIds.length,
        id: groupChat.id,
        isPairs: groupChat.isPairs,
        membersIDs: updatedMembersIds as [string],
        membersNames: updatedNames as [string],
        membersNamesAndIDs: updatedMembersNamesAndIDs as [string],
        name: groupChat.name,
        ownerID: groupChat.ownerID
      }
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
            await deleteOwnSearchedGroup(globalSelectedSearchedGroup)
        },
      },
    ];

    </script>
    
    <style scoped>

    </style>