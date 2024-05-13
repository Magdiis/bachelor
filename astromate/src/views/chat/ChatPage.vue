<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button id="chat-conversation-navigate-back-button" :class="returnColorClass" default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button id="trigger-popover-edit-users" @click="isPopoverOpen = true">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ currentGroupChat.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" ref="content" :scroll-events="true">

      <ion-popover trigger="trigger-popover-edit-users" :is-open="isPopoverOpen"  @didDismiss="isPopoverOpen=false" size="auto" :dismiss-on-select="true">
        <ion-content v-if="currentGroupChat.ownerID === globalProfile.id">
          <ion-list lines="none">
            <ion-item id="chat-conversation-show-members-item" @click="openModalClosePopover()">
              <ion-icon :icon="peopleOutline" class="ion-padding-end"></ion-icon>
              Zobrazit členy
            </ion-item>
            <ion-item @click="editOwnGroup()">
              <ion-icon :icon="pencilOutline" class="ion-padding-end"></ion-icon>
              Upravit skupinu
            </ion-item>
            <ion-item @click="deleteOwnGroup()">
              <ion-icon :icon="trashOutline" class="ion-padding-end"></ion-icon>
              Smazat skupinu
            </ion-item>
          </ion-list>
        </ion-content>
        <ion-content v-else>
          <ion-list lines="none">
            <ion-item @click="openModalClosePopover()">
              <ion-icon :icon="peopleOutline" class="ion-padding-end"></ion-icon>
              Zobrazit členy
            </ion-item>
            <ion-item :button="true" :detail="false" @click="isPopoverOpen=false" id="present-alert-delete-chat">
              <ion-icon  :icon="logOutOutline" class="ion-padding-end"></ion-icon>
              Opustit skupinu
            </ion-item>
          </ion-list>
          <ion-alert
              trigger="present-alert-delete-chat"
              header="Opravdu chcete opustit tuto skupinu?"
              :buttons="cancelOrConfirmButtonsLeavingGroup"
          >
          </ion-alert>
        </ion-content>
      </ion-popover>

      <ion-modal id="chat-page-members-modal" :is-open="isModalOpen">
        <ion-content>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="#" @click="isModalOpen=false"></ion-back-button>
            </ion-buttons>
            <ion-title>
              Členové
            </ion-title>
          </ion-toolbar>
          <ion-list>
            <ion-item  @click="openSheet(idAndName)" v-if="currentGroupChat != undefined" v-for="idAndName in currentGroupChat.membersNamesAndIDs">
              <member-row :id-and-name="idAndName"></member-row>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

      <ion-modal  :is-open="isModalForProfileOpen">
        <ion-content style="--background: var(--ion-color-blue); --color:white">
          <ion-toolbar>
            <ion-title>
              Profil člena
            </ion-title>
            <ion-buttons slot="start">
              <ion-back-button default-href="#" @click="isModalForProfileOpen=false"></ion-back-button>
            </ion-buttons>
          </ion-toolbar>
          <div v-if="selectedProfile != undefined">
            <profile-in-modal :profile="selectedProfile"></profile-in-modal>
          </div>
          <div v-else>
            <h1 class="ion-padding">
              Chyba při načítání profilu
            </h1>
          </div>
        </ion-content>
      </ion-modal>


      <ion-action-sheet
          id="chat-page-action-sheet"
          :is-open="isSheetOpen"
          header="Akce"
          @willDismiss="dismissActionSheet($event)"
          :buttons="returnActionSheetButtons(currentName)">
      </ion-action-sheet>

      <ion-list>
        <div v-for="message in textMessages">
          <own-message-row v-if="message.sentById == globalProfile.id" :text-message="message"
                           :color="currentGroupChat.color"></own-message-row>
          <foreign-message-row v-else :text-message="message" :color="currentGroupChat.color"></foreign-message-row>
        </div>
      </ion-list>
      <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-textarea id="chat-conversation-textarea-input" v-model="messageText" fill="outline" class="ion-padding" placeholder="Zpráva"></ion-textarea>
        <ion-button id="chat-conversation-send-message-button" fill="clear" slot="end" @click="createMessage(
                {
                id: '',
                messageText: messageText,
                sentAt: Timestamp.now() ,
                sentById: globalProfile.id,
                sentByName: globalProfile.name},currentGroupChat.id)">
          <ion-icon :class="returnColorClass" slot="icon-only" :icon="send"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonActionSheet,
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonPopover,
  IonTextarea,
  IonTitle,
  IonToolbar, onIonViewDidLeave,
  onIonViewWillEnter
} from "@ionic/vue";
import {useRoute, useRouter} from "vue-router";
import {ChatParams, GroupChat, TextMessage} from "@/model/chat/Chat";
import {computed, reactive, ref} from "vue";
import {collection, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {db} from "@/firebase-service";
import savingToFirestore from "@/composables/savingToFirestore";
import {
  ellipsisHorizontal,
  ellipsisVertical,
  logOutOutline,
  pencilOutline,
  peopleOutline,
  send,
  trashOutline,
} from 'ionicons/icons'
import {globalProfile} from "@/composables/store/profileStore";
import OwnMessageRow from "@/components/chat/ownMessageRow.vue";
import ForeignMessageRow from "@/components/chat/foreignMessageRow.vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {currentGroupChat, useGroupChatStore} from "@/composables/store/useGroupChatStore";
import updateInFirestore from "@/composables/updateInFirestore";
import {Group} from "@/model/group/Group";
import {globalGroups, useGroupStore} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {NotificationMessage, notificationText} from "@/model/notification/NotificationMessage";
import MemberRow from "@/components/chat/memberRow.vue";
import {Profile} from "@/model/profile/Profile";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import ProfileInModal from "@/components/profile/profileInModal.vue";
import deletingInFirestore from "@/composables/deletingInForestore";
import {useOwnGroupStore} from "@/composables/store/useOwnGroupStore";
import {convertCategory} from "@/composables/categoryConvertor";

const router = useRouter()
const route = useRoute()
const groupChatStore = useGroupChatStore()
const groupStore = useGroupStore()
const ownGroupStore = useOwnGroupStore()
const saveToFirestore = savingToFirestore()
const fetchFromFirestore = fetchingFirebase()
const deleteInFirestore = deletingInFirestore()

const content = ref(null as any | null)

const isModalOpen = ref<boolean>(false)
const isSheetOpen = ref<boolean>(false)
const isModalForProfileOpen = ref<boolean>(false)
const isPopoverOpen = ref<boolean>(false)

const profiles = ref<Profile[]>([])
const selectedProfile = ref<Profile>()

const loading = ref(false)

const messageText = ref("")

const textMessages = ref<Array<TextMessage>>([])


const currentName = ref("")
onIonViewDidLeave(()=>{
  isPopoverOpen.value = false
  isModalOpen.value = false
  isSheetOpen.value = false
})

onIonViewWillEnter(async () => {
  if(currentGroupChat.id != ''){
  profiles.value = []
  const path = "chats/" + currentGroupChat.id + '/messages'
  //const path = "chats/"+"nejakyDocumentID"+'/messages'
  const q = query(collection(db, path), orderBy("sentAt"))
  onSnapshot(q, (querySnapshot) => {
    textMessages.value = []
    querySnapshot.forEach((doc) => {
      textMessages.value.push({
        id: doc.id,
        messageText: doc.data().messageText,
        sentAt: doc.data().sentAt,
        sentById: doc.data().sentById,
        sentByName: doc.data().sentByName
      })
    })
    setTimeout(() => ScrollToBottom(), 100);
  }, (error) => {
    console.error("Error text messages: ", error)
  })
    profiles.value = await fetchFromFirestore.fetchMembersProfiles(currentGroupChat.membersIDs)
  }

})

const getSelectedProfile = (name: string) : Profile| undefined => {
  return profiles.value.find((profile)=>{
    return profile.name === name
  })
}

async function createMessage(textMessage: TextMessage, chatId: string) {
  if (textMessage.messageText.length > 0) {
    await (savingToFirestore().createTextMessage(textMessage, chatId))
    messageText.value = ""
  }
}

function openModalClosePopover(){
  isPopoverOpen.value = false
  isModalOpen.value = true
}


// EDIT GROUP
async function editOwnGroup(){
// TODO: EDIT OWN GROUP
  const ownGroup = ownGroupStore.returnOwnGroup(currentGroupChat.id)
  if(ownGroup){
    const {workCaseThis,sportCaseThis} = convertCategory(ownGroup.useCase,ownGroup.category)
    const toGroup: Group = {
      id:ownGroup.id,
      userId: ownGroup.userId,
      name:ownGroup.name,
      maxMembers: ownGroup.maxMembers,
      currentMembers: ownGroup.currentMembers,
      description: ownGroup.description,
      useCase: ownGroup.useCase,
      workCase: workCaseThis,
      sportCase:sportCaseThis ,
      membersIDs: ownGroup.membersIDs,
      color: ownGroup.color
    }
    groupStore.setEditingGroup(toGroup)
    await router.push({name:routesNames.SearchPeopleEdit})
  } else {
    loading.value = true
    const group = await fetchFromFirestore.getGroupById(currentGroupChat.id)
    groupStore.setEditingGroup(group)
    loading.value = false
    await router.push({name:routesNames.SearchPeopleEdit})
  }

}

// DELETE GROUP
async function deleteOwnGroup(){
  loading.value = true
  await deleteInFirestore.deleteGroup(currentGroupChat.id)
  await (updateInFirestore().setGroupIdEmptyInGroups(currentGroupChat.id))
  await sendNotificationToMembers(currentGroupChat)
  loading.value = false
  router.back()
}

async function sendNotificationToMembers(groupChat: GroupChat){
  if(groupChat.membersIDs.length>0){
    for (const id of groupChat.membersIDs){
      if(id !== globalProfile.id){
        const notificationMessage: NotificationMessage = {
          groupDocumentID: groupChat.id,
          groupName: groupChat.name,
          id: groupChat.id,
          read: false,
          receiver: id,
          sender: globalProfile.id,
          senderName: globalProfile.name,
          sentAt: Timestamp.now(),
          text: notificationText.UserDeleteGroup,
          toBeDeleted: false,
          userDocumentID: ""
        }
        await savingToFirestore().createNotification(notificationMessage)
      }
    }
  }
}


// MANAGE USERS

// LEAVE GROUP
async function leaveGroup() {
  if(currentGroupChat.id != ''){
    loading.value = true
    const findedGroupChat = groupChatStore.getGroupChat(currentGroupChat.id)
    const findedSearchedGroup = await (fetchingFirebase().getSearchedGroupByGroupId(currentGroupChat.id,globalProfile.id))
    // leave from groupChat
    await (updateInFirestore().leaveGroupChat(leaveChatGroup(findedGroupChat)))
    // FROM STORE - SET GROUP_ID = ""
    await (updateInFirestore().setGroupId(findedSearchedGroup.id, "",""))
    // THIS GROUP IS NOT IN STORE - REMOVE FROM MEMBERS
    await (updateInFirestore().removeFromGroup(currentGroupChat.id, globalProfile.id))

    // SEND NOTIFICATION
    const notificationMessage: NotificationMessage = {
      groupDocumentID: findedGroupChat.id, groupName: findedGroupChat.name, id: "", read: false,
      receiver: findedGroupChat.ownerID, sender: globalProfile.id, senderName: globalProfile.name,
      sentAt: Timestamp.now(), text: notificationText.UserLeaveGroup, toBeDeleted: false, userDocumentID: findedSearchedGroup.id

    }
    await saveToFirestore.createNotification(notificationMessage)

    await router.push({name: routesNames.GroupChats})
    loading.value = false
  }

}


function leaveChatGroup(groupChat: GroupChat): GroupChat {
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
    color: groupChat.color, countMembers: updatedMembersIds.length, id: groupChat.id, isPairs: groupChat.isPairs,
    membersIDs: updatedMembersIds as [string], membersNames: updatedNames as [string],
    membersNamesAndIDs: updatedMembersNamesAndIDs as [string], name: groupChat.name, ownerID: groupChat.ownerID
  }
}


// REMOVE USER
async function removeUser(name: string){
  if(currentGroupChat.id != ''){
    loading.value = true
    const removingId:string = returnUserId(currentGroupChat, name)
    const updatedGroupChat: GroupChat = removeUserFromGroupChat(currentGroupChat, name, removingId)

    // remove from groupChat
    await (updateInFirestore().leaveGroupChat(updatedGroupChat))

    // not in store - set groupId = ""
    await (updateInFirestore().removeGroupFromSearchedGroup(currentGroupChat.id,removingId))

    // from store - remove from group members
    const findedGroup: Group = await fetchFromFirestore.getGroupById(currentGroupChat.id)

    await (updateInFirestore().removeUserFromGroup(removeUserFromGroup(findedGroup,removingId)))
    // NOTIFICATION
    const notification: NotificationMessage = {
      groupDocumentID: currentGroupChat.id, groupName: currentGroupChat.name, id: "", read: false,
      receiver: removingId, sender: globalProfile.id, senderName: globalProfile.name, sentAt: Timestamp.now(),
      text: notificationText.UserRemovedUser, toBeDeleted: false, userDocumentID: "" // snad nevadi
    }
    await saveToFirestore.createNotification(notification)
    // AFTER ALL UPDATES
    groupChatStore.updateCurrentGroupChat(updatedGroupChat)
    loading.value = false
  }
}



function removeUserFromGroupChat(groupChat: GroupChat ,removingName: string, removingId: string): GroupChat{
  const updatedMembersIds = groupChat.membersIDs.filter((g) => {
    return g !== removingId
  })
  const updatedNames = groupChat.membersNames.filter((n) => {
    return n !== removingName
  })

  const updatedMembersNamesAndIDs = groupChat.membersNamesAndIDs.filter((m) => {
    return !m.includes(removingName + ";" + removingId)
  })

  return {
    color: groupChat.color, countMembers: updatedMembersIds.length, id: groupChat.id,
    isPairs: groupChat.isPairs, membersIDs: updatedMembersIds as [string], membersNames: updatedNames as [string],
    membersNamesAndIDs: updatedMembersNamesAndIDs as [string], name: groupChat.name, ownerID: groupChat.ownerID
  }

}

function returnUserId(groupChat: GroupChat, removingName: string): string {
  const removingIds: string[] = groupChat.membersNamesAndIDs.filter((m) => {
    return m.includes(removingName + ";")
  })
  return removingIds[0].substring(removingIds[0].indexOf(";")+1)
}

function removeUserFromGroup(group: Group, removingId: string): Group{
  const updatedMembersIds =  group.membersIDs.filter((id: string) => {
      return id !== removingId
  })
  return {color: group.color, currentMembers: updatedMembersIds.length, description: group.description,
    id: group.id, maxMembers: group.maxMembers, membersIDs: updatedMembersIds, name: group.name,
    sportCase: group.sportCase, useCase: group.useCase, userId: group.userId, workCase: group.workCase
  }
}
function viewProfile(currentName: string){
  selectedProfile.value = getSelectedProfile(currentName)
  isModalForProfileOpen.value = true
}
// ALERT BUTTONS
const cancelOrConfirmButtonsLeavingGroup = [
  {text: 'Zrušit', role: 'cancel', cssClass: 'alert-button-cancel', handler: () => {console.log('Alert canceled');},},
  {text: 'Opustit', role: 'confirm', cssClass: 'alert-button-confirm', handler: () => {leaveGroup()},},
];

const cancelOrConfirmButtonsRemoveUser = [
  {text: 'Zrušit', role: 'cancel', cssClass: 'alert-button-cancel', handler: () => {console.log('Alert canceled');},},
  {text: 'Opustit', role: 'confirm', cssClass: 'alert-button-confirm', handler: () => {console.log("removing user")},},
];

// ACTION SHEET BUTTONS
const returnActionSheetButtons = (name: string) => {
  if(globalProfile.id === currentGroupChat.ownerID){
    if(name === globalProfile.name){
      return [{text: 'Zobrazit profil', data: {action: 'profile',},},]
    } else {return [{text: 'Odebrat uživatele', role: 'destructive', data: {action: 'remove',},},
      {text: 'Zobrazit profil', data: {action: 'profile',},},]
    }
  } else {
    return [{text: 'Zobrazit profil', data: {action: 'profile',},}]
  }

}

const dismissActionSheet = (ev: CustomEvent) => {
  isSheetOpen.value = false
  const event = ev.detail.data.action
  if (event === "remove"){
    removeUser(currentName.value)
  }
  if (event === "profile"){
    viewProfile(currentName.value)
  }
};

const openSheet = (idAndName: string) =>{
  const name = idAndName.substring(0, idAndName.indexOf(";"))
  isSheetOpen.value = true
  currentName.value = name
}

// EVENTS
function ScrollToBottom() {
  content.value?.$el.scrollToBottom();
}

// COMPUTED CSS CLASSES
const returnColorClass = computed(() => {
    switch (currentGroupChat.color) {
      case colorsCases.Blue: {
        return "custom-blue"
      }
      case colorsCases.Green: {
        return "custom-green"
      }
      case colorsCases.Orange: {
        return "custom-orange"
      }
      case colorsCases.Red: {
        return "custom-dark-red"
      }
      default: {
        return "custom-dark-red"
      }
    }

})

</script>

<style scoped>
.ion-padding {
  padding: 8px
}


button.alert-button.alert-button-cancel {
  background-color: var(--ion-color-success);
  color: var(--ion-color-success-contrast);
}


</style>