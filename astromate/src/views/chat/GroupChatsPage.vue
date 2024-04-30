<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading >
<!--    <no-messages-placeholder></no-messages-placeholder>-->
      <ion-list>
        <ion-list-header>
          <h4>Moje vytvořené skupiny</h4>
        </ion-list-header>
        <ion-item id="group-chats-own-chat-group-item" v-for="chat in myGroupChats" >
          <chat-row :group-chat="chat"></chat-row>
        </ion-item>
        <ion-list-header>
          <h4>Ostaní</h4>
        </ion-list-header>
        <ion-item id="group-chats-other-chat-group-item" v-for="chat in otherGroupChats">
          <chat-row :group-chat="chat" ></chat-row>
        </ion-item>
      </ion-list>
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
  IonList,
  IonListHeader,
  IonItem,
  onIonViewWillEnter, IonLoading
} from '@ionic/vue';
import chatRow from '@/components/chat/chatRow.vue'
import {colorsCases} from '@/model/group/createGroupEnums';
import {personOutline, peopleOutline, personRemoveSharp} from 'ionicons/icons'
import {ref} from "vue";
import {ChatParams, GroupChat} from "@/model/chat/Chat";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import {globalProfile} from "@/composables/store/profileStore";
import router from "@/router";
import {routesNames} from "@/router/routesNames";
import {globalGroupChats, useGroupChatStore} from "@/composables/store/useGroupChatStore";
import NoGroups from "@/components/placeholders/NoGroups.vue";
import NoNotifications from "@/components/placeholders/NoNotifications.vue";
import NoMessagesPlaceholder from "@/components/placeholders/NoMessagesPlaceholder.vue";

const groupChatStore = useGroupChatStore()

const myGroupChats = ref<Array<GroupChat>>([])
const otherGroupChats = ref<Array<GroupChat>>([])
const loading = ref(false)
const isEmpty = ref(false)


onIonViewWillEnter(async () => {
  console.log("refreshing group chats")
  loading.value = true
  const groupsFromFirebase = await fetchGroupChats()
  groupChatStore.setGroupChats(groupsFromFirebase)
  filterMyAndOthersGroupChats(groupsFromFirebase)
  isEmpty.value = myGroupChats.value.length < 1 && otherGroupChats.value.length < 1
  loading.value = false
})

async function fetchGroupChats(): Promise<GroupChat[]> {
  return await (fetchingFirebase().fetchGroupChats(globalProfile.id))
}

function filterMyAndOthersGroupChats(groupsChat: GroupChat[]) {
  myGroupChats.value = []
  otherGroupChats.value = []
  groupsChat.forEach((chat) => {
    if (chat.ownerID == globalProfile.id) {
      myGroupChats.value.push(chat)
    } else {
      otherGroupChats.value.push(chat)
    }
  })
}


</script>

<style scoped>
h3 {
  font-weight: bold;
}
</style>