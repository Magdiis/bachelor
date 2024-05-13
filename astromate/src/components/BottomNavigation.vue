<template>
<ion-page>
    <ion-tabs ref="tabs" id="bottom-navigation">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
            <ion-tab-button id="bottom-navigation-button-profile" tab="profile" href="/tabs/profile">
            <ion-icon :icon="personOutline" />
            <ion-label>Profil</ion-label>
            </ion-tab-button>


              <ion-tab-button class="bottom-navigation-button-discover" tab="discover" href="/tabs/groups">
                <ion-icon :icon="searchOutline" />
                <ion-label>Hledám</ion-label>
              </ion-tab-button>


            <ion-tab-button id="bottom-navigation-button-chat" tab="chat" href="/tabs/groupChats">
            <ion-icon :icon="peopleOutline" />
            <ion-label>Skupiny</ion-label>
            </ion-tab-button>


            <ion-tab-button id="bottom-navigation-button-notification" tab="notification" href="/tabs/notification">
              <ion-icon :icon="notification.isNotEmpty ? notificationsOutline : undefined"
                        :src="notification.isNotEmpty ? undefined : '/notification/not-new.svg'" />
              <ion-label>Notifikace</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
</ion-page>

</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

import {
  personOutline,
  person,
  search,
  searchOutline,
  chatbubbles,
  chatbubblesOutline,
  notifications,
  notificationsOutline,
  peopleOutline
} from 'ionicons/icons'
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {onMounted, reactive, ref, watch} from "vue";
import {globalNotifications, isNotificationEmpty} from "@/composables/store/notificationStore";

const router = useRouter()

const notification = reactive({
  isNotEmpty: isNotificationEmpty.value
})
  watch(isNotificationEmpty, (newNotif) => {
    notification.isNotEmpty = newNotif
  })


</script>

<style scoped>


</style>