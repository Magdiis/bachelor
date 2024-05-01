<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Hledám</ion-title>
        <ion-buttons slot="end">
            <ion-button id="navigate-to-create-group-button" @click="router.push({name: routesNames.AddGroup})">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
    <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    <div v-if="!loading">
      <no-searching v-if="isEmpty"></no-searching>
      <ion-list v-else>
        <ion-list-header  v-if="globalGroups.length > 0">
            <h4>
              Hledám lidi
            </h4>
        </ion-list-header>
        <own-group-row v-for="group in ownGroups" :own-group="group"></own-group-row>

        <ion-list-header v-if="globalSearchedGroups.length > 0">
          <h4>
            Hledám skupiny
          </h4>
        </ion-list-header>
        <own-searched-group-row v-for="user in ownUsers" :ownUser="user"></own-searched-group-row>
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
import NoGroups from "@/components/placeholders/NoGroups.vue";
import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
import {convertCategory} from "@/composables/categoryConvertor";
import {OwnGroup} from "@/model/group/ownGroupsResponse";
import {OwnUser} from "@/model/group/ownUsersResponse";
import NoSearching from "@/components/placeholders/NoSearching.vue";

const router = useRouter()
const groupsStore = useGroupStore()
const matchingBackend = fetchingMatchingBackend()

const loading = ref(false)
const isEmpty = ref(false)

const ownGroups = ref<OwnGroup[]>([])
const ownUsers = ref<OwnUser[]>([])


onIonViewWillEnter(async()=>{
  ownGroups.value = []
  ownUsers.value = []
  loading.value = true
  await fetchOwnGroups()
  await fetchOwnUsers()
  isEmpty.value = globalSearchedGroups.length < 1 && globalGroups.length < 1;
  loading.value = false
})


async function fetchOwnGroups() {
  const groupsFromBackend = await matchingBackend.getOwnGroups(globalProfile.id)
  let groups: Group[] = []
  groupsFromBackend.forEach((g)=>{
    const {sportCaseThis, workCaseThis} = convertCategory(g.useCase,g.category)
    groups.push({
      color: g.color,
      currentMembers: g.currentMembers,
      description: g.description,
      id: g.id,
      maxMembers: g.maxMembers,
      membersIDs: g.membersIDs,
      name: g.name,
      sportCase: sportCaseThis,
      useCase: g.useCase,
      userId: g.userId,
      workCase: workCaseThis
    })
  })
  groupsStore.setOwnGroups(groups)
  ownGroups.value.push(...groupsFromBackend)
}

async function fetchOwnUsers() {
  const usersFromBackend = await matchingBackend.getOwnUsers(globalProfile.id)
  let users: User[] = []
  usersFromBackend.forEach((u)=>{
    const {sportCaseThis, workCaseThis} = convertCategory(u.useCase,u.category)
    users.push({
      color: u.color, groupId: u.groupId, groupName: u.groupName,
      id: u.id, sportCase: sportCaseThis, useCase: u.useCase, userId: u.userId, workCase: workCaseThis
    })
  })
  groupsStore.setSearchedGroups(users)
  ownUsers.value.push(...usersFromBackend)
}




</script>

<style scoped>
</style>