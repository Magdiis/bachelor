<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-list>
      <ion-list-header>
        <h3>Moje vytvořené skupiny</h3>
      </ion-list-header>
      
      <ion-item>
        <chat-row :color="colorsCases.Red" :is-one-profile="false"></chat-row>
      </ion-item>
      
    </ion-list>
    <ion-list>
      <ion-list-header>
        <h3>Ostatní</h3>
      </ion-list-header>
      <ion-item>
        <chat-row :color="colorsCases.Green" :is-one-profile="true"></chat-row>
      </ion-item>
      <ion-item>
        <chat-row :color="colorsCases.Orange" :is-one-profile="false"></chat-row>
      </ion-item>
    </ion-list>
        </ion-content>
        </ion-page>

</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, 
IonHeader, IonToolbar,IonLabel, IonButton, IonRow, IonCol, IonGrid, IonList, IonListHeader, IonItem} from '@ionic/vue';
import chatRow from '@/components/chat/chatRow.vue'
import { colorsCases } from '@/model/createGroupEnums';
import {personOutline, peopleOutline, personRemoveSharp} from 'ionicons/icons'

</script>

<style scoped>
h3{
font-weight: bold;
}
</style>