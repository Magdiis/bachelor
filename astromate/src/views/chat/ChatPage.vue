<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button :class="returnColorClass" default-href="#" @click="router.back"></ion-back-button>
                </ion-buttons>
        <ion-title>{{ chatParams.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" ref="content" :scroll-events="true" >
      <ion-list>
        <div v-for="message in textMessages">
          <own-message-row v-if="message.sentById == globalProfile.id" :text-message="message" :color="chatParams.color"></own-message-row>
          <foreign-message-row v-else :text-message="message" :color="chatParams.color"></foreign-message-row>
        </div>
      </ion-list>
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
  IonBackButton, IonButtons,
  IonCard, IonCardContent, IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage, IonTitle,
  IonToolbar,IonFooter, IonRow, IonGrid,IonInput,IonButton,
    IonTextarea, IonIcon, IonList,IonItem,
  onIonViewWillEnter
} from "@ionic/vue";
import {useRoute, useRouter} from "vue-router";
import {routesNames} from "@/router/routesNames";
import {ChatParams, TextMessage} from "@/model/chat/Chat";
import {computed, reactive, ref} from "vue";
import {collection, getDocs, onSnapshot, query, Query, Timestamp, where, orderBy} from "firebase/firestore";
import {db, groups_chat_collection} from "@/firebase-service";
import savingToFirestore from "@/composables/savingToFirestore";
import {send } from 'ionicons/icons'
import {globalProfile} from "@/composables/store/profileStore";
import OwnMessageRow from "@/components/chat/ownMessageRow.vue";
import ForeignMessageRow from "@/components/chat/foreignMessageRow.vue";
import {colorsCases} from "@/model/group/createGroupEnums";

const router = useRouter()
const route = useRoute()

const content = ref(null as any | null)

const chatParams = reactive<ChatParams>({
  id: "",
  name: "",
  color: ""
})

const messageText = ref("")

const textMessages = ref<Array<TextMessage>>([])

onIonViewWillEnter(async ()=>{
  getChatParamsFromRoute()
  const path = "chats/"+chatParams.id+'/messages'
  //const path = "chats/"+"nejakyDocumentID"+'/messages'
  const q = query(collection(db,path), orderBy("sentAt"))
  onSnapshot(q, (querySnapshot) => {
  textMessages.value = []
    querySnapshot.forEach((doc)=>{
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
    console.error("Error text messages: ",error)
  })
})

function getChatParamsFromRoute(){
  const chatParamsString = route.params.chatParams
  const params: ChatParams = JSON.parse(chatParamsString.toString())
  Object.assign(chatParams, params)
  console.log("params changed", params)
}

async function createMessage(textMessage: TextMessage, chatId: string){
  if(textMessage.messageText.length > 0){
    await (savingToFirestore().createTextMessage(textMessage, chatId))
    messageText.value = ""
  }
}

function ScrollToBottom() {
  content.value?.$el.scrollToBottom();
}


// COMPUTED CSS CLASSES
const returnColorClass = computed(() => {
    switch(chatParams.color) {
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
.ion-padding{
  padding: 8px
}

</style>