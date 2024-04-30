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

        <ion-content :fullscreen="true" :class="colors.contentColor">

          <ion-grid v-if="placeholderAfterDecision.isShown" style="height: 100%; width: 100%; align-items: center; align-content: center; z-index: 1000; position: fixed; ">
            <ion-row style="flex-direction: column;align-content: center;align-items: center">
              <ion-row>
                <ion-col>
                  <ion-icon style="transition-duration: 700ms; transition-property: scale; transition-timing-function: cubic-bezier(0, 0, 0, 1)" :style="placeholderLikeStyle" :icon="placeholderAfterDecision.like ? heart : heartDislike" ></ion-icon>
                </ion-col>
              </ion-row>
            </ion-row>
          </ion-grid>


          <ion-popover trigger="popover-edit-group" size="auto" :dismiss-on-select="true">
            <ion-content>
              <ion-list lines="none">
                <ion-item :button="true" @click="navigateToEditPage()">
                  <ion-icon  :icon="pencilOutline" class="ion-padding-end"></ion-icon>
                  Upravit
                </ion-item>
                <ion-item :button="true" id="present-alert-delete-group">
                  <ion-icon  :icon="trashOutline" class="ion-padding-end"></ion-icon>
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
          <done v-if="isFilled" :user-matching="true"/>
          <no-available v-if="isEmpty" :color="globalSelectedGroup.color" :no-groups-available="false"></no-available>
          <matching-card-user
              v-if="currentUser != undefined && currentProfile != undefined && currentProfilePhotoUrl!=undefined"
              :profile="currentProfile"
              :user="currentUser"
              :url="currentProfilePhotoUrl"
              :color="globalSelectedGroup.color">

          </matching-card-user>

        </ion-content>
      <ion-footer class="ion-no-border " v-if="currentUser != undefined">
        <ion-toolbar :class="colors.toolbarBackground">
          <ion-row style="padding-top: 0.5em; padding-bottom: 0.5em">
            <ion-col>
              <ion-row  class="ion-justify-content-around">
                <ion-img @click="makeDecision(false, currentUser)"  @mousedown="down(false)" :style="buttonStyleDislike" :src="colors.dislikeButton" ></ion-img>
                <ion-img id="user-matching-like-button" @click="makeDecision(true, currentUser)" @mousedown="down(true)" :style="buttonStyleLike" :src="colors.likeButton" ></ion-img>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-footer>

    </ion-page>
    </template>
    
    <script setup lang="ts">
    import {
      IonAlert,
      IonFooter,
      IonBackButton, IonButton,
      IonButtons,
      IonContent,
      IonHeader, IonIcon, IonItem, IonList, IonLoading,
      IonPage, IonPopover,
      IonTitle,
      IonToolbar,
      onIonViewDidEnter, onIonViewDidLeave, onIonViewWillEnter, IonCol, IonRow, IonImg
    } from '@ionic/vue';
    import {useRoute, useRouter} from 'vue-router';
    import {computed, reactive, ref} from 'vue';
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
    import {
      ellipsisHorizontal,
      ellipsisVertical,
      heart,
      heartDislike,
      pencilOutline,
      trashOutline
    } from "ionicons/icons";
    import deletingInFirestore from "@/composables/deletingInForestore";
    import {routesNames} from "@/router/routesNames";
    import {
      globalGroupEditing,
      globalSelectedGroup, globalSelectedSearchedGroup,
      useGroupStore
    } from "@/composables/store/useGroupStore";
    import {returnCategory} from "@/composables/categoryConvertor";
    import NoAvailable from "@/components/placeholders/NoAvailable.vue";
    import {colorsCases} from "@/model/group/createGroupEnums";
    import useStorage from "@/composables/firebaseStorage/useStorage";
    import Done from "@/components/placeholders/Done.vue";

    const router = useRouter()
    const route = useRoute()
    const deleteFirestore = deletingInFirestore()
    const updateFirestore = updateInFirestore()
    const groupStore = useGroupStore()
    const firebaseStorage = useStorage()

    const isEmpty = ref(false) // for placeholder

    const loading = ref(false)
    const isFilled = ref(false)
    const groupsFilter = ref<GroupsFilter>()

    const users =  ref<Array<User>>([])

    const currentUser = ref<User>()
    const currentProfile = ref<Profile>()
    const currentProfilePhotoUrl = ref<string>("")


    const placeholderAfterDecision = reactive({
      isShown: false,
      like: false
    })

    const placeholderLikeStyle = ref<Partial<CSSStyleDeclaration>>({
      fontSize: '1em',
      scale: '1'
    })

    onIonViewWillEnter(async ()=>{
    if(globalSelectedGroup.currentMembers == globalSelectedGroup.maxMembers){
      isFilled.value = true
    } else {
      isFilled.value = false
      getGroupsFilter()
      await fetchOthersUsers()
    }

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
      //animation
      animateLikePlaceholder(like)
      // Save decision
      await saveDecisionToDB(like, user.id)
      // Make notification and send
      if(groupsFilter.value != undefined){
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
        refreshLikePlaceholder()
      } else {
        refreshLikePlaceholder()
        isEmpty.value = true
      }

    }


    async function makeNotification(sender:string, receiver:string,groupName: string, senderName: string,
                                    groupDocumentID:string, userDocumentID: string){
      const newNotification: NotificationMessage = {
        toBeDeleted: false,
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

    // ANIMATION
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
    // CSS CLASS
    const colors = computed(()=>{
      switch (globalSelectedGroup.color) {
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


    .container {
      position: relative;
      text-align: center;
    }

    .centered {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .heart {
      opacity: 0;
      animation: bounceFade 1s ease-in-out forwards;
    }

    @keyframes bounceFade {
      0% {
        transform: scale(1);
        opacity: 0;
      }
      40% {
        transform: scale(3.2);
        opacity: 1;
      }
      60% {
        transform: scale(2.8);
        opacity: 1;
      }
      80% {
        transform: scale(3);
        opacity: 1;
      }
      100% {
        transform: scale(6);
        opacity: 0;
      }
    }
    
    </style>