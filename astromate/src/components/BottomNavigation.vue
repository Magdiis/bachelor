<template>
<ion-page>
    <ion-tabs ref="tabs">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
            <ion-tab-button tab="profile" href="/tabs/profile">
            <ion-icon :icon="personOutline" />
            <ion-label>Profil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="discover" href="/tabs/groups">
            <ion-icon :icon="searchOutline" />
            <ion-label>Hledej</ion-label>
            </ion-tab-button>


            <ion-tab-button tab="chat" href="/tabs/groupChats">
            <ion-icon :icon="chatbubblesOutline" />
            <ion-label>Chat</ion-label>
            </ion-tab-button>


            <ion-tab-button tab="notification" href="/tabs/notification">
            <ion-icon :icon="notificationsOutline" />
            <ion-label>Notifikace</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
</ion-page>

</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

import {personOutline, person,search,searchOutline,chatbubbles,chatbubblesOutline,notifications, notificationsOutline } from 'ionicons/icons'
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";

const router = useRouter()

</script>

<style scoped>


</style>