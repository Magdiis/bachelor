<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button id="group-matching-navigate-back-button" default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button id="popover-edit-searched-group">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Hledání skupin</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true " :class="colors.contentColor">

          <ion-grid v-if="placeholderAfterDecision.isShown" style="height: 100%; width: 100%; align-items: center; align-content: center; z-index: 1000; position: fixed; ">
            <ion-row style="flex-direction: column;align-content: center;align-items: center">
              <ion-row>
                <ion-col>
                  <ion-icon style="transition-duration: 700ms; transition-property: scale; transition-timing-function: cubic-bezier(0, 0, 0, 1)" :style="placeholderLikeStyle" :icon="placeholderAfterDecision.like ? heart : heartDislike" ></ion-icon>
                </ion-col>
              </ion-row>
            </ion-row>
          </ion-grid>

          <ion-popover trigger="popover-edit-searched-group" size="auto" :dismiss-on-select="true">
            <ion-content>
              <ion-list lines="none">
                <ion-item :button="true" @click="navigateToEditPage()">
                  <ion-icon :icon="pencilOutline" class="ion-padding-end"></ion-icon>
                  Upravit
                </ion-item>
                <ion-item :button="true" id="present-alert-delete-searched-group">
                  <ion-icon :icon="trashOutline" class="ion-padding-end"></ion-icon>
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

          <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>
          <done v-if="isFilled" :user-matching="false"/>
          <no-available id="goup-matching-no-available-placeholder" :color="globalSelectedSearchedGroup.color" v-if="isEmpty" :no-groups-available="true"></no-available>
        <matching-card-group
            v-if="currentGroup!=undefined && currentMembers.length>0"
            :group="currentGroup"
            :profiles="currentMembers"
            :group-com="groupCom"
            :color="globalSelectedSearchedGroup.color"/>

        </ion-content>
      <ion-footer class="ion-no-border" v-if="currentGroup != undefined">
        <ion-toolbar :class="colors.toolbarBackground">
          <ion-row style="padding-top: 0.5em; padding-bottom: 0.5em">
            <ion-col>
              <ion-row  class="ion-justify-content-around">
                <ion-img @click="makeDecision(false, currentGroup)"  @mousedown="down(false)" :style="buttonStyleDislike" :src="colors.dislikeButton" ></ion-img>
                <ion-img id="group-matching-like-button" @click="makeDecision(true, currentGroup)" @mousedown="down(true)" :style="buttonStyleLike" :src="colors.likeButton" ></ion-img>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-footer>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import {
      IonModal,
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
      IonAlert, IonLoading, IonImg, IonFooter, onIonViewDidLeave
    } from '@ionic/vue';
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import type { Group } from '@/model/group/Group';
    import {ref, reactive, computed} from 'vue';
    import {colorsCases, SportCases, useCase, workCases} from '@/model/group/createGroupEnums';
    import {
      closeOutline,
      ellipsisHorizontal,
      ellipsisVertical,
      heart, heartDislike,
      logOutOutline,
      pencilOutline,
      trashOutline
    } from 'ionicons/icons';
import {returnCategory} from '@/composables/categoryConvertor'
import { GroupsFilter } from '@/model/group/GroupsFilter';
import  MatchingCardGroup from '@/components/MatchingCardGroup.vue'
    import savingToFirestore from "@/composables/savingToFirestore";

    import {Timestamp} from "firebase/firestore";
    import updateInFirestore from "@/composables/updateInFirestore";
    import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
    import {Profile} from "@/model/profile/Profile";
    import {NotificationMessage, notificationNames, notificationText} from "@/model/notification/NotificationMessage";
    import {auth} from "@/firebase-service";
    import {globalProfile} from "@/composables/store/profileStore";
    import {globalSelectedGroup, globalSelectedSearchedGroup, useGroupStore} from "@/composables/store/useGroupStore";
    import {routesNames} from "@/router/routesNames";
    import deletingInFirestore from "@/composables/deletingInForestore";
    import {User} from "@/model/group/User";
    import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
    import {GroupChat} from "@/model/chat/Chat";
    import NoAvailable from "@/components/placeholders/NoAvailable.vue";
    import Done from "@/components/placeholders/Done.vue";
    import fetchingFirebase from "@/composables/fetchingFromFirestore";
    import {groupCompatibility} from "@/composables/empheremis/useCompatibility";
    import {useOwnGroupStore} from "@/composables/store/useOwnGroupStore";
    
    const router = useRouter()
    const route = useRoute()
    const groupStore = useGroupStore()
    const ownGroupStore = useOwnGroupStore()
    const groupChatStore = useGroupChatStore()
    const deleteFirestore = deletingInFirestore()
    const updateFirestore = updateInFirestore()

    const groups = ref<Array<Group>>([])
    
    const groupsFilter = ref<GroupsFilter>()

    const currentGroup = ref<Group>()

    const groupCom = ref(0)

    const currentMembers = ref<Array<Profile>>([])

    const isEmpty = ref(false) // for placeholder
    const isFilled = ref(false)

    const loading = ref(false)
    const footer = reactive({isVisible: false})
    const isProfileDetailOpen = ref<boolean>(false)

    const placeholderAfterDecision = reactive({
      isShown: false,
      like: false
    })

    onIonViewDidLeave(()=>{
      currentGroup.value = undefined
      currentMembers.value = []
      isEmpty.value = false
      isFilled.value = false
      groups.value = []
    })

    onIonViewDidEnter(async()=>{
      if(globalSelectedSearchedGroup.groupId != ""){
        isFilled.value = true
      } else {
        isFilled.value = false
        getGroupsFilter()
        await fetchOthersGroups()
        console.log("selected group ", globalSelectedSearchedGroup)
      }

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
            loading.value = false
            isEmpty.value = true
          }
        }
    }

    async function fetchMembers(membersIDs: string[]){
      const profilesFromFirebase = await (fetchingFromFirestore().fetchMembersProfiles(membersIDs))
      currentMembers.value = []
      currentMembers.value.push(...profilesFromFirebase)
      let allProfiles = []
      allProfiles.push(globalProfile)
      allProfiles.push(...profilesFromFirebase)
      groupCom.value = groupCompatibility(allProfiles)
    }



    function getGroupsFilter() {
        groupsFilter.value = {
          category: returnCategory(globalSelectedSearchedGroup.useCase,globalSelectedSearchedGroup.workCase,globalSelectedSearchedGroup.sportCase),
          name: globalSelectedSearchedGroup.groupName,
          useCase: globalSelectedSearchedGroup.useCase,
          userId: globalSelectedSearchedGroup.userId,
          userOrGroupID_card: globalSelectedSearchedGroup.id
        }
    }

    async function makeDecision(like:boolean, group: Group){
      //animation
      animateLikePlaceholder(like)
      // Save decision
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
        await addUsersSeenBy(globalSelectedSearchedGroup.id, currentGroup.value.userId)
      }
      // change current group to next one and remove
      await nextGroup()

    }



    async function nextGroup(){
     // groups.value.shift()  //remove first element
      groups.value = groups.value.slice(1)
      currentGroup.value = groups.value[0]
      if(currentGroup.value != undefined){
        await fetchMembers(currentGroup.value?.membersIDs)
        refreshLikePlaceholder()
      } else {
        refreshLikePlaceholder()
        isEmpty.value = true
      }
    }

    async function addGroupsSeenBy(groupID: string){
        await updateFirestore.addGroupsSeenBy(groupID,globalProfile.id)
    }

    async function addUsersSeenBy(userDocumentId: string, ownerId: string){
      await updateFirestore.addUsersSeenBy(userDocumentId, ownerId)
    }


    async function makeNotification(sender:string, receiver:string, groupName: string,
                                    senderName: string,groupDocumentID:string, userDocumentID: string){
      const newNotification: NotificationMessage = {
        toBeDeleted: false,
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
      console.log("searched group to delete: ", searchedGroup)
      loading.value = true
      // DELETE SEARCHED GROUP
      await deleteFirestore.deleteSearchedGroup(searchedGroup.id)
      if(searchedGroup.groupId != ""){
        // LEAVE GROUP (REMOVE MEMBER FROM LIST)
        await updateFirestore.removeFromGroup(searchedGroup.groupId, globalProfile.id)

        // LEAVE GROUP CHAT
        const groupChat = await fetchingFirebase().getGroupChat(searchedGroup.groupId)
        const updatedGroupChat = leaveGroupChat(groupChat)
        await updateFirestore.leaveGroupChat(updatedGroupChat)

        // NOTIFICATION
        const notificationMessage: NotificationMessage = {
          groupDocumentID: groupChat.id,
          groupName: groupChat.name,
          id: "",
          read: false,
          receiver: groupChat.ownerID,
          sender: globalProfile.id,
          senderName: globalProfile.name,
          sentAt: Timestamp.now(),
          text: notificationText.UserLeaveGroup,
          toBeDeleted: false,
          userDocumentID: ""
        }
        await savingToFirestore().createNotification(notificationMessage)

      }
      // NAVIGATE
      // FETCH GROUPS AFTER DELETE
      await ownGroupStore.getGroupsFromBackend()
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


    // CSS CLASS
    const colors = computed(()=>{
      switch (globalSelectedSearchedGroup.color) {
        case colorsCases.Blue:
          return {
            contentColor: 'ion-content-blue',
            likeButton: 'matching/like-blue.svg',
            dislikeButton: 'matching/dislike-blue.svg',
            toolbarBackground: 'toolbar-background-blue'
          }
        case colorsCases.Green:
          return {
            contentColor:'ion-content-green',
            likeButton: 'matching/like-green.svg',
            dislikeButton: 'matching/dislike-green.svg',
            toolbarBackground: 'toolbar-background-green'
          }
        case colorsCases.Red:
          return{
            contentColor: 'ion-content-red',
            likeButton: 'matching/like-red.svg',
            dislikeButton: 'matching/dislike-red.svg',
            toolbarBackground: 'toolbar-background-red'
          }
        case colorsCases.Orange:
          return {
            contentColor: 'ion-content-orange',
            likeButton: 'matching/like-orange.svg',
            dislikeButton: 'matching/dislike-orange.svg',
            toolbarBackground: 'toolbar-background-orange'
          }
        default : {
          return {
            contentColor: 'ion-content-blue',
            likeButton: 'matching/like-blue.svg',
            dislikeButton: 'matching/dislike-blue.svg',
            toolbarBackground: 'toolbar-background-blue'
          }
        }
      }
    })

    // CSS
    // clicking on button
    const buttonStyleLike = ref<Partial<CSSStyleDeclaration>>({
      width: '20vw',
      scale: '1'
    })

    const buttonStyleDislike = ref<Partial<CSSStyleDeclaration>>({
      width: '20vw',
      scale: '1'
    })

    const down = (like:boolean)=>{
      if(like){
        buttonStyleLike.value.scale = '0.9'
        setTimeout(()=>{
          buttonStyleLike.value.scale = '1'
        },70)
      } else {
        buttonStyleDislike.value.scale = '0.9'
        setTimeout(()=>{
          buttonStyleDislike.value.scale = '1'
        },70)
      }
    }

    // like / dislike
    const placeholderLikeStyle = ref<Partial<CSSStyleDeclaration>>({
      fontSize: '1em',
      scale: '1'
    })

    // animation
    function animateLikePlaceholder(like: boolean){
      placeholderAfterDecision.like = like
      placeholderAfterDecision.isShown = true
      setTimeout(()=>{
        placeholderLikeStyle.value.scale = '20'
      },0)
    }

    function refreshLikePlaceholder(){
      placeholderAfterDecision.isShown = false
      placeholderLikeStyle.value.fontSize='1em'
      placeholderLikeStyle.value.scale='1'
    }
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

    .toolbar-background-green {
      --background: var(--ion-color-green)
    }

    .toolbar-background-red {
      --background: var(--ion-color-darkRed)
    }


    .toolbar-background-blue {
      --background: var(--ion-color-blue)
    }
    .toolbar-background-orange {
      --background: var(--ion-color-orange)
    }

    </style>