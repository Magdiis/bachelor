<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button default-href="#" @click="router.back"></ion-back-button>
                </ion-buttons>
        <ion-title>{{ chatParams.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" ref="content" :scroll-events="true" >
      <ion-list>
        <ion-item v-for="message in textMessages">
          {{message.sentByName}}: {{message.messageText}}
        </ion-item>
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
              <ion-icon slot="icon-only" :icon="send"></ion-icon>
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
import {ChatParams, TextMessage} from "@/model/Chat";
import {reactive, ref} from "vue";
import {collection, getDocs, onSnapshot, query, Query, Timestamp, where, orderBy} from "firebase/firestore";
import {db, groups_chat_collection} from "@/firebase-service";
import savingToFirestore from "@/composables/savingToFirestore";
import {send } from 'ionicons/icons'
import {globalProfile} from "@/composables/store/profileStore";

const router = useRouter()
const route = useRoute()

const content = ref(null as any | null)

let chatParams = reactive<ChatParams>({
  id: "", name: ""
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
  chatParams = params
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

</script>

<style scoped>
.ion-padding{
  padding: 8px
}



</style>