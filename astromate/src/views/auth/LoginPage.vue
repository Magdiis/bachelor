<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Přihlášení</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-col>
          <ion-input
              ref="input"
              type="email"
              fill="solid"
              label="Email"
              label-placement="floating"
              error-text="Invalid email"
              v-model="loginInfo.email"
          >
            <div v-if="isEmptyProm" slot="label"> <ion-text color="danger">Povinné</ion-text></div>
          </ion-input>


          <ion-input fill="solid" label="Password" label-placement="floating" type="password" value="password" v-model="loginInfo.password">
            <div v-if="isEmptyProm" slot="label"> <ion-text color="danger">Povinné</ion-text></div>
          </ion-input>

          <ion-text v-if="emailFormat.length > 0"> {{emailFormat}} </ion-text>
          <ion-text v-if="authResponse.errorMessage.length > 0"> {{ authResponse.errorMessage}}</ion-text>
          <ion-button @click="LogIn(loginInfo)">Přihlásit se</ion-button>

          <ion-button @click="router.push({name: routesNames.Registration})">Vytvořit účet</ion-button>
        </ion-col>
        <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
      </ion-grid>

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
  IonLoading, onIonViewWillLeave, onIonViewWillEnter,
} from "@ionic/vue";
import {reactive, ref, UnwrapNestedRefs} from "vue";
import {Login} from "@/model/auth/Login";
import type {Profile} from "@/model/profile/Profile";
import authentication from "@/composables/authentication/authentication";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {AuthResponse} from "@/model/auth/AuthResponse";
import {auth} from "@/firebase-service";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import {globalProfile, useProfileStore} from "@/composables/store/profileStore";


const router = useRouter()
const profileStore = useProfileStore()

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

async function LogIn(loginInfo: Login){
  isEmpty(loginInfo)
  console.log(loginInfo.password)
  if (!emailValidation(loginInfo.email)){
    emailFormat.value = "E-mail je ve špatném formátu."
  } else {
    loading.value = true
    authResponse.value = await (authentication().signIn(loginInfo.email, loginInfo.password))
    if (authResponse.value.user != null){
      profileStore.setId(authResponse.value.user.user.uid)
      console.log(authResponse.value.user.user.uid)
      await navigate(globalProfile.id)
    }
    loading.value = false
  }
}

function emailValidation(email: string): boolean {
  if(email.length > 0){
    return email.match(
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
  } else {
    return true
  }
}

function isEmpty(loginInfo: Login){
  isEmptyProm.value = loginInfo.email.length < 1 || loginInfo.password.length < 1;
}

async function navigate(profileID:string){
  if(await (fetchingFirebase().isProfileExist(profileID))){
    await router.push({name: routesNames.Groups})
  } else {
    await router.push({name: routesNames.CreateProfile})
  }
}

onIonViewWillLeave(()=>{
  loginInfo.password = ""
  loginInfo.email = ""
})

onIonViewWillEnter(()=>{
  // console.log("current user", auth.currentUser)
  // if(authentication().isUserLoggedIn()){
  //   navigate()
  // }
})

function saveToPinia(){

}

</script>


<style scoped>

</style>