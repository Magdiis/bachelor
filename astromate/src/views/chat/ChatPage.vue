<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :class="returnColorClass" default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button id="trigger-popover-edit-users">
            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ chatParams.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" ref="content" :scroll-events="true">


      <ion-popover trigger="trigger-popover-edit-users" size="auto" :dismiss-on-select="true">
        <ion-content v-if="chatParams.isAdmin">
          <ion-list lines="none">
            <ion-item @click="isModalOpen=true">
              <ion-icon :icon="peopleOutline" class="ion-padding-end"></ion-icon>
              Zobrazit členy
            </ion-item>
          </ion-list>
        </ion-content>
        <ion-content v-else>
          <ion-list lines="none">
            <ion-item :button="true" :detail="false" id="present-alert-delete-chat">
              <ion-icon  :icon="logOutOutline" class="ion-padding-end"></ion-icon>
              Opustit skupinu
            </ion-item>
          </ion-list>
          <ion-alert
              trigger="present-alert-delete-chat"
              header="Opravdu chcete opustit tuto skupinu?"
              :buttons="cancelOrConfirmButtons"
          >
          </ion-alert>
        </ion-content>

      </ion-popover>

      <ion-modal :is-open="isModalOpen">
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
            <ion-item @click="openSheet(name)" v-if="currentGroupChat != undefined" v-for="name in currentGroupChat.membersNames">
                {{name }}
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>


      <ion-action-sheet
          :is-open="isSheetOpen"
          @willDismiss="dismissActionSheet($event)"
          :buttons="returnActionSheetButtons(currentName)">
      </ion-action-sheet>

      <ion-list>
        <div v-for="message in textMessages">
          <own-message-row v-if="message.sentById == globalProfile.id" :text-message="message"
                           :color="chatParams.color"></own-message-row>
          <foreign-message-row v-else :text-message="message" :color="chatParams.color"></foreign-message-row>
        </div>
      </ion-list>
      <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-textarea v-model="messageText" fill="outline" class="ion-padding" placeholder="Zpráva"></ion-textarea>
        <ion-button fill="clear" slot="end" @click="createMessage(
                {
                id: '',
                messageText: messageText,
                sentAt: Timestamp.now() ,
                sentById: globalProfile.id,
                sentByName: globalProfile.name},chatParams.id)">
          <ion-icon :class="returnColorClass" slot="icon-only" :icon="send"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonList, IonLoading,
  IonPage,
  IonPopover,
  IonTextarea,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
    IonModal,
    IonActionSheet

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
  send,
  personRemoveOutline, personOutline, peopleOutline,
} from 'ionicons/icons'
import {globalProfile} from "@/composables/store/profileStore";
import OwnMessageRow from "@/components/chat/ownMessageRow.vue";
import ForeignMessageRow from "@/components/chat/foreignMessageRow.vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
import updateInFirestore from "@/composables/updateInFirestore";
import {Group} from "@/model/group/Group";
import {globalGroups, globalSearchedGroups, useGroupStore} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {currentGroupChat} from "@/composables/store/useGroupChatStore";
import {useDocument} from "vuefire";
import {NotificationMessage, notificationText} from "@/model/notification/NotificationMessage";

const router = useRouter()
const route = useRoute()
const groupChatStore = useGroupChatStore()
const groupStore = useGroupStore()
const saveToFirestore = savingToFirestore()

const content = ref(null as any | null)

const isModalOpen = ref<boolean>(false)
const isSheetOpen = ref<boolean>(false)

const chatParams = reactive<ChatParams>({
  id: "",
  name: "",
  color: "",
  isAdmin: false
})



const loading = ref(false)

const messageText = ref("")

const textMessages = ref<Array<TextMessage>>([])

const currentName = ref("")

onIonViewWillEnter(async () => {
  getChatParamsFromRoute()
  const path = "chats/" + chatParams.id + '/messages'
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
  groupChatStore.setCurrentGroupChat(chatParams.id)

})

function getChatParamsFromRoute() {
  const chatParamsString = route.params.chatParams
  const params: ChatParams = JSON.parse(chatParamsString.toString())
  Object.assign(chatParams, params)
}

async function createMessage(textMessage: TextMessage, chatId: string) {
  if (textMessage.messageText.length > 0) {
    await (savingToFirestore().createTextMessage(textMessage, chatId))
    messageText.value = ""
  }
}

// MANAGE USERS

// LEAVE GROUP
async function leaveGroup() {
  loading.value = true
  const findedGroupChat = groupChatStore.getGroupChat(chatParams.id)
  const findedSearchedGroup = groupStore.getSearchedGroupByGroupId(chatParams.id)
  // leave from groupChat
  await (updateInFirestore().leaveGroupChat(leaveChatGroup(findedGroupChat)))
  // FROM STORE - SET GROUP_ID = ""
  await (updateInFirestore().setGroupId(findedSearchedGroup.id, "",""))
  // THIS GROUP IS NOT IN STORE - REMOVE FROM MEMBERS
  await (updateInFirestore().removeFromGroup(chatParams.id, globalProfile.id))

  // SEND NOTIFICATION
  const notificationMessage: NotificationMessage = {
    groupDocumentID: findedGroupChat.id,
    groupName: findedGroupChat.name,
    id: "",
    read: false,
    receiver: findedGroupChat.ownerID,
    sender: globalProfile.id,
    senderName: globalProfile.name,
    sentAt: Timestamp.now(),
    text: notificationText.UserLeaveGroup,
    toBeDeleted: false,
    userDocumentID: findedSearchedGroup.id

  }
  await saveToFirestore.createNotification(notificationMessage)

  await router.push({name: routesNames.GroupChats})
  loading.value = false
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


// REMOVE USER
async function removeUser(name: string){
  loading.value = true
  const findedGroupChat: GroupChat = groupChatStore.getGroupChat(chatParams.id)
  const removingId:string = returnUserId(findedGroupChat, name)
  const updatedGroupChat: GroupChat = removeUserFromGroupChat(findedGroupChat, name, removingId)

  // remove from groupChat
  await (updateInFirestore().leaveGroupChat(updatedGroupChat))

  // not in store - set groupId = ""
  await (updateInFirestore().removeGroupFromSearchedGroup(findedGroupChat.id,removingId))

  // from store - remove from group members
  const findedGroup: Group = groupStore.getGroup(findedGroupChat.id)
  await (updateInFirestore().removeUserFromGroup(removeUserFromGroup(findedGroup,removingId)))
  // NOTIFICATION
  const notification: NotificationMessage = {
    groupDocumentID: findedGroupChat.id,
    groupName: findedGroupChat.name,
    id: "",
    read: false,
    receiver: removingId,
    sender: globalProfile.id,
    senderName: globalProfile.name,
    sentAt: Timestamp.now(),
    text: notificationText.UserRemovedUser,
    toBeDeleted: false,
    userDocumentID: "" // snad nevadi
  }
  await saveToFirestore.createNotification(notification)
  // AFTER ALL UPDATES
  groupChatStore.updateCurrentGroupChat(updatedGroupChat)
  loading.value = false

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

  return {
    color: group.color,
    currentMembers: updatedMembersIds.length,
    description: group.description,
    id: group.id,
    maxMembers: group.maxMembers,
    membersIDs: updatedMembersIds,
    name: group.name,
    sportCase: group.sportCase,
    useCase: group.useCase,
    userId: group.userId,
    workCase: group.workCase
  }
}
function viewProfile(){

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
    text: 'Opustit',
    role: 'confirm',
    cssClass: 'alert-button-confirm',
    handler: () => {
      leaveGroup()
    },
  },
];

// ACTION SHEET BUTTONS
const returnActionSheetButtons = (name: string) => {
  if(name === globalProfile.name){
    return [
        //TODO
      // {
      //   text: 'Zobrazit profil',
      //   data: {
      //     action: 'profile',
      //   },
      // },
    ]
  } else {
    return [
      {
        text: 'Odebrat uživatele',
        data: {
          action: 'remove',
        },
      },
        // TODO
      // {
      //   text: 'Zobrazit profil',
      //   data: {
      //     action: 'profile',
      //   },
      // },
    ]
  }
}

const dismissActionSheet = (ev: CustomEvent) => {
  isSheetOpen.value = false
  const event = ev.detail.data.action
  if (event === "remove"){
    console.log("remove")
    removeUser(currentName.value)
  }
  if (event === "profile"){
    viewProfile()
    console.log("profile")
  }
};

const openSheet = (name: string) =>{
  isSheetOpen.value = true
  currentName.value = name
}

// EVENTS
function ScrollToBottom() {
  content.value?.$el.scrollToBottom();
}

// COMPUTED CSS CLASSES
const returnColorClass = computed(() => {
  switch (chatParams.color) {
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