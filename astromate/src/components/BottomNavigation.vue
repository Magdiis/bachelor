<template>
<ion-page>
    <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
            <ion-tab-button @click="" tab="profile" href="/profile">
            <ion-icon :icon="person" />
            <ion-label>Profil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="discover" href="/groups">
            <ion-icon :icon="search" />
            <ion-label>Hledej</ion-label>
            </ion-tab-button>


            <ion-tab-button tab="chat" href="/groupChats">
            <ion-icon :icon="chatbubbles" />
            <ion-label>Chat</ion-label>
            </ion-tab-button>


            <ion-tab-button tab="notification" href="/notification">
            <ion-icon :icon="notifications" />
            <ion-label>Notifikace</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
</ion-page>

</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

import {personOutline, person,search,searchOutline,chatbubbles,chatbubblesOutline,notifications, notificationsOutline } from 'ionicons/icons'


</script>

<style scoped>

ion-tab-button{
    --color-selected: #000000;
}
</style>