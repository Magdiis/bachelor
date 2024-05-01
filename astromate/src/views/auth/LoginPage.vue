
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Přihlášení</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" >

      <div class="center ion-padding">
        <ion-icon style="font-size:9em;" src="/auth/lock-icon.svg"></ion-icon>
      </div>

      <div class="ion-padding-horizontal">
        <ion-input id="login_email_input" style="margin-top: 8px" ref="input" type="email" fill="outline" label="Email" label-placement="floating"
                   error-text="Špatný email" :helper-text="isInputEmpty.email ? 'povinné': '' " v-model="loginInfo.email"
                   class="padding-half-top custom">
        </ion-input>

        <ion-input id="login_password_input" class="ion-margin-top custom" fill="outline" label="Password" label-placement="floating" type="password"
                   error-text="Špatné heslo" value="password" v-model="loginInfo.password" :helper-text="isInputEmpty.password ? 'povinné' : ''">
        </ion-input>
          <div class="ion-padding-vertical">
            <ion-button id="login_button"  expand="block" shape="round"  @click="LogIn(loginInfo)">Přihlásit se</ion-button>

          </div>
          <ion-button expand="block" shape="round" fill="outline"
                       @click="router.push({name: routesNames.Registration})">Vytvořit účet
          </ion-button>


      </div>

      <div class="ion-padding">
        <ion-text color="danger"  v-if="authResponse.errorMessage.length > 0"> {{ authResponse.errorMessage }}</ion-text>
      </div>

      <ion-loading :is-open="loading" spinner="lines-small"></ion-loading>

      <!-- delete -->
<!--      <ion-button @click="router.push({name:routesNames.CreateProfile})"> create profile </ion-button>-->
<!--      <ion-button shape="round" @click="LoginHardcore()">Login hardcore</ion-button>-->
    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {colorsCases} from "@/model/group/createGroupEnums";
import {
  IonImg,
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
  IonLoading, onIonViewWillLeave, onIonViewWillEnter, IonIcon, onIonViewDidLeave,
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
import {listenNotifications} from "@/composables/store/notificationStore";


const router = useRouter()
const profileStore = useProfileStore()
const fetchFromFirebase = fetchingFirebase()
const groupStore = useGroupStore()
const groupChatStore = useGroupChatStore()


const isInputEmpty = reactive({
  email: false,
  password: false
})

const loading = ref<boolean>(false)

const loginInfo: Login = reactive({
  email: "",
  password: ""
})

const authResponse = ref<AuthResponse>({errorMessage: "", user: null})

async function LogIn(loginInfo: Login) {
  isEmpty(loginInfo)
  console.log(loginInfo.password)
  if(!isInputEmpty.email && !isInputEmpty.password){
    loading.value = true
    authResponse.value = await (authentication().signIn(loginInfo.email, loginInfo.password))
    if (authResponse.value.user != null) {

      // SET STORES
      await saveToStores(authResponse.value.user.user.uid)
      listenNotifications()
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

function isEmpty(loginInfo: Login) {
  isInputEmpty.email = loginInfo.email.length < 1
  isInputEmpty.password = loginInfo.password.length < 1
}

async function navigate(profileID: string) {
  if (await (fetchingFirebase().isProfileExist(profileID))) {
    await router.push({name: routesNames.Groups})
  } else {
    await router.push({name: routesNames.CreateProfile})
  }
}

onIonViewDidLeave(() => {
  loginInfo.password = ""
  loginInfo.email = ""
  isInputEmpty.password = false
  isInputEmpty.email = false
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

}

</script>


<style scoped>




</style>