<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Notifikace</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list v-if="filteredNotifications.length > 0">
        <notification-row v-for="n in filteredNotifications" :notification="n"></notification-row>
      </ion-list>
      <no-notifications v-else></no-notifications>
        </ion-content>
        </ion-page>

</template>
<script setup lang="ts" >
import { IonPage, IonContent, IonTitle,IonList,
IonHeader, IonToolbar, IonItem, IonRow, IonCol, IonGrid,onIonViewWillEnter} from '@ionic/vue';

import {computed, ref} from "vue";

import {NotificationMessage} from "@/model/notification/NotificationMessage";
import {onSnapshot, orderBy, query, Query, where} from "firebase/firestore";
import {auth, notification_collection} from "@/firebase-service";
import NotificationRow from "@/components/notifications/NotificationRow.vue";
import {globalProfile} from "@/composables/store/profileStore";
import NoNotifications from "@/components/placeholders/NoNotifications.vue";


const notifications = ref<Array<NotificationMessage>>([])

const filteredNotifications = computed(()=>notifications.value.filter(n => !n.toBeDeleted))
const isEmpty = ref(false)

onIonViewWillEnter(()=>{
    const q : Query = query(notification_collection,where("receiver","==", globalProfile.id),where("read","==",false))
    onSnapshot(q, (querySnapshot)=>{
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
              userDocumentID: doc.data().userDocumentID,
              toBeDeleted: false
            })
          })
          isEmpty.value = filteredNotifications.value.length < 1
        }, (error) => {
          console.error("Error fetching notifications: ",error)
        })
})



</script>

<style scoped>
</style>