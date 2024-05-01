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
import {globalNotifications, isNotificationEmpty, listenNotifications} from "@/composables/store/notificationStore";


const notifications = ref<Array<NotificationMessage>>([])

const filteredNotifications = computed(()=>globalNotifications.value.filter(n => !n.toBeDeleted))





</script>

<style scoped>
</style>