<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>Registrace</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" >


      <div class="center ion-padding">
        <ion-img style="height: 144px" src="/auth/register-user-icon.svg"></ion-img>
      </div>

      <div class="ion-padding-horizontal">
        <ion-input id="registration_email_input" class="custom" ref="input" type="email" fill="outline" label="Email" label-placement="floating"
                   :helper-text="isInputEmpty.email ? 'povinné': '' "   error-text="Špatný email" v-model="loginInfo.email">

        </ion-input>
        <ion-input id="registration_password_input" class="ion-margin-top custom"  fill="outline" label="Heslo" label-placement="floating" type="password" value="heslo"
                   :helper-text="isInputEmpty.password ? 'povinné' : ''" error-text="Špatné heslo" v-model="loginInfo.password">

        </ion-input>
      </div>


      <div class="ion-padding">
        <ion-button id="registration_button" expand="block" shape="round" @click="register(loginInfo)">Registrovat</ion-button>
      </div>

      <div class="ion-padding">
        <ion-text color="danger"  v-if="authResponse.errorMessage.length > 0"> {{ authResponse.errorMessage}}</ion-text>
      </div>

      <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonImg,
  IonBackButton, IonButton,
  IonButtons, IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon,
  IonInput, IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar, onIonViewDidEnter, onIonViewDidLeave, onIonViewWillLeave
} from "@ionic/vue";
import {reactive, ref} from "vue";
import {Login} from "@/model/auth/Login";
import {useRouter} from "vue-router";
import authentication from "@/composables/authentication/authentication";
import {routesNames} from "@/router/routesNames";
import {AuthResponse} from "@/model/auth/AuthResponse";
import {useProfileStore} from "@/composables/store/profileStore";
import {listenNotifications} from "@/composables/store/notificationStore";


const router = useRouter()
const profileStore = useProfileStore()


const loading = ref<boolean>(false)

const isInputEmpty = reactive({
  email: false,
  password: false
})



const loginInfo: Login = reactive({
  email: "",
  password: ""
})



const authResponse = ref<AuthResponse>({errorMessage: "", user: null})


function isEmpty(loginInfo: Login){
  isInputEmpty.email = loginInfo.email.length < 1
  isInputEmpty.password = loginInfo.password.length < 1
}


async function register(loginInfo: Login){
  isEmpty(loginInfo)

  if(!isInputEmpty.email && !isInputEmpty.password){
    loading.value = true
    authResponse.value = await (authentication().createProfile(loginInfo.email,loginInfo.password))
    loading.value = false
    if (authResponse.value.user != null){
      //router.back()
      profileStore.setId(authResponse.value.user.user.uid)
      listenNotifications()
      navigate()
    }
  }
}

function navigate(){
  router.push({name: routesNames.CreateProfile})
}

onIonViewDidLeave(()=>{
  loginInfo.password = ""
  loginInfo.email = ""
  isInputEmpty.password = false
  isInputEmpty.email = false
})
</script>
<style scoped>



</style>