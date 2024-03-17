<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list v-if="myGroupChats.length > 0">
        <ion-list-header>
          <h3>Moje vytvořené skupiny</h3>
        </ion-list-header>
        <ion-item v-for="chat in myGroupChats" >
          <chat-row :group-chat="chat"></chat-row>
        </ion-item>
      </ion-list>
      <ion-list v-if="otherGroupChats.length > 0">
        <ion-list-header>
          <h3>Ostatní</h3>
        </ion-list-header>
        <ion-item v-for="chat in otherGroupChats">
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
  onIonViewWillEnter
} from '@ionic/vue';
import chatRow from '@/components/chat/chatRow.vue'
import {colorsCases} from '@/model/createGroupEnums';
import {personOutline, peopleOutline, personRemoveSharp} from 'ionicons/icons'
import {ref} from "vue";
import {ChatParams, GroupChat} from "@/model/Chat";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import {globalProfile} from "@/composables/store/profileStore";
import router from "@/router";
import {routesNames} from "@/router/routesNames";


const myGroupChats = ref<Array<GroupChat>>([])
const otherGroupChats = ref<Array<GroupChat>>([])
const loading = ref(false)


onIonViewWillEnter(async () => {
  loading.value = true
  const groupsFromFirebase = await fetchGroupChats()
  filterMyAndOthersGroupChats(groupsFromFirebase)
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