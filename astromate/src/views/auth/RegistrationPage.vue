<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
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
          <ion-text v-if="loginInfo.errorMessage.length > 0"> {{ loginInfo.errorMessage}}</ion-text>
          <ion-text v-if="authResponse.errorMessage.length > 0"> {{ authResponse.errorMessage}}</ion-text>
          <ion-button @click="register(loginInfo)">Registrovat</ion-button>
        </ion-col>
        <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
      </ion-grid>



    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonBackButton, IonButton,
  IonButtons, IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonInput, IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar, onIonViewWillLeave
} from "@ionic/vue";
import {reactive, ref} from "vue";
import {Login} from "@/model/Login";
import {useRouter} from "vue-router";
import authentication from "@/composables/authentication/authentication";
import {routesNames} from "@/router/routesNames";
import {AuthResponse} from "@/model/auth/AuthResponse";
import {useProfileStore} from "@/composables/store/profileStore";

const router = useRouter()
const profileStore = useProfileStore()

const isPasswordLongEnough = ref(true)
const loading = ref<boolean>(false)
const emailFormat = ref("")

const loginInfo: Login = reactive({
  email: "",
  password: "",
  errorMessage: ""
})

const isEmptyProm = ref(false)

const authResponse = ref<AuthResponse>({errorMessage: "", user: null})

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

function isPasswordLengthGraterThanSix(password: string):boolean {
    isPasswordLongEnough.value = password.length > 5
    return isPasswordLongEnough.value
}

async function register(loginInfo: Login){
  isEmpty(loginInfo)

  if (!emailValidation(loginInfo.email) || !isPasswordLengthGraterThanSix(loginInfo.password)){
    loginInfo.errorMessage = "Nespravny format emailu. Nebo heslo musi byt delsi nez 6 znaku."
  } else {
    loginInfo.errorMessage = ""
    loading.value = true
    authResponse.value = await (authentication().createProfile(loginInfo.email,loginInfo.password))
    loading.value = false
    if (authResponse.value.user != null){
      profileStore.setId(authResponse.value.user.user.uid)
      navigate()
    }
  }
}

function navigate(){
  router.push({name: routesNames.CreateProfile})
}

onIonViewWillLeave(()=>{
  loginInfo.password = ""
  loginInfo.email = ""
})
</script>
<style scoped>



</style>