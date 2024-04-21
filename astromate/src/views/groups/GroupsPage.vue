<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Skupiny</ion-title>
        <ion-buttons slot="end">
            <ion-button  @click="router.push({name: routesNames.AddGroup})">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    <div v-if="!loading">
      <ion-list>
        <ion-list-header  v-if="globalGroups.length > 0">
            <h4>
              Hledám lidi
            </h4>
        </ion-list-header>
        <own-group-row v-for="group in globalGroups" :group="group"></own-group-row>
        <ion-list-header v-if="globalSearchedGroups.length > 0">
          <h4>
            Hledám skupiny
          </h4>
        </ion-list-header>
        <own-searched-group-row v-for="user in globalSearchedGroups" :user="user"></own-searched-group-row>
      </ion-list>
    </div>

    </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonIcon,
IonHeader, IonToolbar, IonButton,  IonButtons, IonLoading,
IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,  onIonViewWillEnter,
 onIonViewDidEnter, IonList, IonListHeader, IonItem} from '@ionic/vue';
import {add} from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { routesNames } from '@/router/routesNames';
import {onMounted, ref, reactive} from 'vue'
import savingToFirestore from '@/composables/savingToFirestore'
import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
import type { Group } from '@/model/group/Group';
import type { User } from '@/model/group/User'
import {auth} from "@/firebase-service";
import {globalProfile} from "@/composables/store/profileStore";
import {globalGroups, globalSearchedGroups, useGroupStore} from "@/composables/store/useGroupStore";
import {globalGroupChats} from "@/composables/store/useGroupChatStore";
import OwnGroupRow from "@/components/search/OwnGroupRow.vue";
import OwnSearchedGroupRow from "@/components/search/OwnSearchedGroupRow.vue";

const router = useRouter()
const groupsStore = useGroupStore()

const loading = ref(false)



onIonViewDidEnter(async()=>{
  console.log("group chats: ",globalGroupChats)
  console.log("own groups: ", globalGroups)
  console.log("own searched groups: ", globalSearchedGroups)
  loading.value = true
  await fetchOwnGroups()
  await fetchOwnUsers()
  loading.value = false
})


async function fetchOwnGroups() {

      const groupsFromFirebase = await fetchingFromFirestore().getOwnGroups(globalProfile.id)
      // groups.length = 0 // clear
      //groups.push(...groupsFromFirebase) //push
      groupsStore.setOwnGroups(groupsFromFirebase)

}

async function fetchOwnUsers() {
      const usersFromFirebase = await fetchingFromFirestore().getOwnUsers(globalProfile.id)
      groupsStore.setSearchedGroups(usersFromFirebase)
}




</script>

<style scoped>
</style>