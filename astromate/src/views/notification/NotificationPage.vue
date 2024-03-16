<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Notifikace</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
  <!--    <ion-item v-for="n in notifications"> -->
        <notification-row v-for="n in notifications" :notification="n"></notification-row>
  <!--    </ion-item> -->
        </ion-content>
        </ion-page>

</template>
<script setup lang="ts" >
import { IonPage, IonContent, IonTitle, 
IonHeader, IonToolbar, IonItem, IonRow, IonCol, IonGrid,onIonViewWillEnter} from '@ionic/vue';

import {ref} from "vue";

import {NotificationMessage} from "@/model/NotificationMessage";
import {onSnapshot, orderBy, query, Query, where} from "firebase/firestore";
import {auth, notification_collection} from "@/firebase-service";
import NotificationRow from "@/components/notifications/NotificationRow.vue";
import {globalProfile} from "@/composables/store/profileStore";


const notifications = ref<Array<NotificationMessage>>([])

// function processNotifications(snapshot: QuerySnapshot<DocumentData>){
//
// }

onIonViewWillEnter(()=>{
    const q : Query = query(notification_collection,where("receiver","==", globalProfile.id))
    onSnapshot(q,
        (querySnapshot)=>{
          // processNotifications(querySnapshot)
          notifications.value = []
          querySnapshot.forEach((doc) => {
            notifications.value.push({
              groupName: doc.data().groupName,
              senderName: doc.data().senderName,
              id: doc.id,
              read: doc.data().read,
              sentAt: doc.data().sentAt,
              text: doc.data().text,
              sender: doc.data().sender,
              receiver: doc.data().receiver,
              groupDocumentID: doc.data().groupDocumentID,
              userDocumentID: doc.data().userDocumentID
            })
          })
        }, (error) => {
          console.error("Error fetching notifications: ",error)
        })
})



</script>

<style scoped>
</style>