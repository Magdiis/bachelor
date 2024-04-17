
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Přihlášení</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" >

      <div class="center ion-padding">
        <ion-icon style="font-size:9em;" src="/lock-icon.svg"></ion-icon>
      </div>

      <div class="ion-padding-horizontal">
        <ion-input style="margin-top: 8px" ref="input" type="email" fill="solid" label="Email" label-placement="floating"
                   error-text="Špatný email" v-model="loginInfo.email"
                   class="padding-half-top">
          <!--            <ion-icon slot="start" :icon="mailOutline" aria-hidden="true"></ion-icon>-->
          <div v-if="isEmptyProm" slot="label">
            <ion-text color="danger">Povinné</ion-text>
          </div>
        </ion-input>

        <ion-input class="ion-margin-top" fill="solid" label="Password" label-placement="floating" type="password"
                   error-text="Špatné heslo" value="password" v-model="loginInfo.password">
          <div v-if="isEmptyProm" slot="label">
            <ion-text color="danger">Povinné</ion-text>
          </div>
        </ion-input>
          <div class="ion-padding-vertical">
            <ion-button  expand="block" shape="round"  @click="LogIn(loginInfo)">Přihlásit se</ion-button>

          </div>
          <ion-button  expand="block" shape="round" fill="outline"
                       @click="router.push({name: routesNames.Registration})">Vytvořit účet
          </ion-button>

<!--        <ion-button shape="round" @click="LoginHardcore()">Login hardcore</ion-button>-->
      </div>

      <div class="ion-padding">
        <ion-text color="danger"  v-if="emailFormat.length > 0"> {{ emailFormat }}</ion-text>
        <ion-text color="danger"  v-if="authResponse.errorMessage.length > 0"> {{ authResponse.errorMessage }}</ion-text>
      </div>

      <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {colorsCases} from "@/model/group/createGroupEnums";
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonCol,
  IonButton,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonText,
  IonLoading, onIonViewWillLeave, onIonViewWillEnter, IonIcon,
} from "@ionic/vue";
import {reactive, ref, UnwrapNestedRefs, watchSyncEffect} from "vue";
import {Login} from "@/model/auth/Login";
import type {Profile} from "@/model/profile/Profile";
import authentication from "@/composables/authentication/authentication";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {AuthResponse} from "@/model/auth/AuthResponse";
import {auth} from "@/firebase-service";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import {globalProfile, useProfileStore} from "@/composables/store/profileStore";
import {useGroupStore} from "@/composables/store/useGroupStore";
import {useGroupChatStore} from "@/composables/store/useGroupChatStore";
import {lockClosed, mailOutline} from "ionicons/icons";


const router = useRouter()
const profileStore = useProfileStore()
const fetchFromFirebase = fetchingFirebase()
const groupStore = useGroupStore()
const groupChatStore = useGroupChatStore()

const input = ref(null)
const isEmptyProm = ref(false)
const emailFormat = ref("")
const loading = ref<boolean>(false)

const loginInfo: Login = reactive({
  email: "",
  password: "",
  errorMessage: ""
})

const authResponse = ref<AuthResponse>({errorMessage: "", user: null})

async function LogIn(loginInfo: Login) {
  isEmpty(loginInfo)
  console.log(loginInfo.password)
  if (!emailValidation(loginInfo.email)) {
    emailFormat.value = "E-mail je ve špatném formátu."
  } else {
    loading.value = true
    authResponse.value = await (authentication().signIn(loginInfo.email, loginInfo.password))
    if (authResponse.value.user != null) {
      console.log(authResponse.value.user.user.uid)
      // SET STORES
      await saveToStores(authResponse.value.user.user.uid)

      await navigate(globalProfile.id)
    }
    loading.value = false
  }
}

async function LoginHardcore() {
  loading.value = true
  authResponse.value = await (authentication().signIn("m@m.cz", "123456"))
  if (authResponse.value.user != null) {
    profileStore.setId(authResponse.value.user.user.uid)
    console.log(authResponse.value.user.user.uid)
    await navigate(globalProfile.id)
    loading.value = false
  }
}

function emailValidation(email: string): boolean {
  if (email.length > 0) {
    return email.match(
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
  } else {
    return true
  }
}

function isEmpty(loginInfo: Login) {
  isEmptyProm.value = loginInfo.email.length < 1 || loginInfo.password.length < 1;
}

async function navigate(profileID: string) {
  if (await (fetchingFirebase().isProfileExist(profileID))) {
    await router.push({name: routesNames.Groups})
  } else {
    await router.push({name: routesNames.CreateProfile})
  }
}

onIonViewWillLeave(() => {
  loginInfo.password = ""
  loginInfo.email = ""
})

onIonViewWillEnter(() => {
  // TODO: remember logged user
  // console.log("current user", auth.currentUser)
  // if(authentication().isUserLoggedIn()){
  //   navigate()
  // }
})

async function saveToStores(profileId: string) {
  // PROFILE
  profileStore.setId(profileId)
  // PHOTO PATH

  // GROUPS
  const ownSearchedGroups = await fetchFromFirebase.getOwnUsers(profileId)
  groupStore.setOwnSearchedGroups(ownSearchedGroups)
  const ownGroups = await fetchFromFirebase.getOwnGroups(profileId)
  groupStore.setOwnGroups(ownGroups)

  //GROUP CHATS
  const groupChats = await fetchFromFirebase.fetchGroupChats(profileId)
  groupChatStore.setGroupChats(groupChats)

}

</script>


<style scoped>
.center {
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center; /* Vertical centering */
  flex-direction: column; /* Align items in a column */
  text-align: center; /* Center text horizontally */
}


</style>