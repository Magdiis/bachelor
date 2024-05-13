<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Skupiny</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

        <no-groups v-if="isEmpty"></no-groups>
        <ion-list v-else>
          <ion-list-header v-if="myGroupChats.length > 0">
            <h4>Moje vytvořené skupiny</h4>
          </ion-list-header>
          <ion-item id="group-chats-own-chat-group-item" v-for="chat in myGroupChats" >
            <chat-row :group-chat="chat"></chat-row>
          </ion-item>
          <ion-list-header v-if="otherGroupChats.length > 0">
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
import {onSnapshot, query, Query, where} from "firebase/firestore";
import {groups_chat_collection, notification_collection} from "@/firebase-service";
import {globalNotifications} from "@/composables/store/notificationStore";

const myGroupChats = ref<Array<GroupChat>>([])
const otherGroupChats = ref<Array<GroupChat>>([])
const allGroupChats = ref<Array<GroupChat>>([])
const groupChatStore = useGroupChatStore()
const isEmpty = ref(false)


onIonViewWillEnter(async () => {
  const q: Query = query(groups_chat_collection, where('membersIDs', "array-contains", globalProfile.id))
  onSnapshot(q, (querySnapshot)=>{
    // processNotifications(querySnapshot)
    allGroupChats.value = []

    querySnapshot.forEach((doc) => {
      allGroupChats.value.push({
        color: doc.data().color,
        countMembers: doc.data().countMembers,
        id: doc.id,
        isPairs: doc.data().isPairs,
        membersIDs: doc.data().membersIDs,
        membersNames: doc.data().membersNames,
        membersNamesAndIDs: doc.data().membersNamesAndIDs,
        name: doc.data().name,
        ownerID: doc.data().ownerID
      })
    })

    isEmpty.value = allGroupChats.value.length < 1
    filterMyAndOthersGroupChats(allGroupChats.value)
    groupChatStore.setGroupChats(allGroupChats.value)
  }, (error) => {
    console.error("Error fetching notifications: ",error)
  })
})

function filterMyAndOthersGroupChats(groupsChat: GroupChat[]) {
  myGroupChats.value = []
  otherGroupChats.value = []
  groupsChat.forEach((chat) => {
    if (chat.ownerID === globalProfile.id) {
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