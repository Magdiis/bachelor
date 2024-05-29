<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>Změna profilu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-vertical">
          <div class="ion-padding-horizontal">
            <ion-input class="custom" :counter="true" maxlength="20" label="Přezdívka" fill="outline"
                       :helper-text="validationValues.isUsernameEmpty ? 'povinné': validationValues.notUniqueUsername ? 'tato přezdívka je již obsazena' : '' "
                       label-placement="floating" error-text="Špatná přezdívka" v-model="editedProfile.name"></ion-input>
          </div>

      <div class="ion-padding-horizontal ion-margin-top">
        <ion-textarea class="custom"
                      :helper-text="validationValues.isDescriptionEmpty ? 'povinné': '' "
                      :counter="true" maxlength="200" label="Popis" label-placement="floating" v-model="editedProfile.description" fill="outline" rows="3"></ion-textarea>
      </div>

      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Temperament"  v-model="editedProfile.temperament">
          <ion-select-option v-for="temp in temperamentValues">
            {{ temp }}
          </ion-select-option>
        </ion-select>
      </div>

      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Plánovací typ"  v-model="editedProfile.plan">
          <ion-select-option v-for="plan in planValues">
            {{ plan }}
          </ion-select-option>
        </ion-select>
      </div>

      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Typ myšlení"  v-model="editedProfile.thinking">
          <ion-select-option v-for="think in thinkingValues">
            {{ think }}
          </ion-select-option>
        </ion-select>
      </div>

      <div class="ion-padding-horizontal ion-padding-top">
        <ion-select interface="popover" label="Tvoření"  v-model="editedProfile.handy">
          <ion-select-option v-for="handy in handyValues">
            {{ handy }}
          </ion-select-option>
        </ion-select>
      </div>

      <div class="ion-padding-start">
        <p> Datum narození</p>
      </div>

      <div  class="center ion-padding-horizontal">
        <ion-datetime presentation="date"
                      :max="max"
                      :min="min"
                      name="Datum narození"
                      v-model="editedProfile.date"
        ></ion-datetime>
      </div>

          <ion-row class="ion-justify-content-center">
            <ion-col size="auto">
              <div v-if="photo != undefined" class="centered-content">
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
                <ion-img :src="photo.webviewPath"></ion-img>
              </div>
              <div class="centered-content" v-else>
                <ion-button @click="takePhoto()" fill="clear">Změnit obrázek</ion-button>
                <ion-thumbnail>
                  <ion-icon class="icon-style" :icon="cameraOutline"></ion-icon>
                </ion-thumbnail>
              </div>
            </ion-col>
          </ion-row>

      <div class="center">
        <ion-button @click="getLocation" shape="round" fill="clear" v-if="buttonName == 'aktualizovat polohu'">
          <ion-icon slot="start" :icon="locationOutline"></ion-icon>
          {{buttonName}}
        </ion-button>
        <ion-button :disabled="true" shape="round" fill="clear" v-else-if="buttonName == 'načítání'">
          {{buttonName}}
        </ion-button>
        <ion-button  color="success" shape="round" fill="clear" v-else>
          <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
          {{buttonName}}
        </ion-button>
      </div>

      <div class="center">
        <ion-text v-if="validationValues.showErrorMessage" color="danger">Špatně vyplněný profil</ion-text>
      </div>

      <div class="ion-padding">
          <ion-button expand="block" shape="round" @click="saveChanges()" >Uložit</ion-button>
      </div>

      <ion-loading :is-open="loading" spinner="lines-small" ></ion-loading>
    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">

import {
  IonCol,
  IonRow,
  IonImg,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonThumbnail,
  IonButton, IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar, onIonViewWillEnter, IonButtons, IonBackButton, onIonViewDidLeave, IonText, IonSelectOption, IonSelect
} from "@ionic/vue";
import {cameraOutline, checkmarkOutline, locationOutline, save} from 'ionicons/icons';
import {computed, reactive, ref} from "vue";
import {handyValues, planValues, Profile, temperamentValues, thinkingValues} from "@/model/profile/Profile";
import {globalProfile, globalProfilePhotoURl, useProfileStore} from "@/composables/store/profileStore";
import {useRouter} from "vue-router";
import {savePicture, usePhotoGallery} from "@/composables/photos/usePhotoGallery";
import updateInFirestore from "@/composables/updateInFirestore";
import {routesNames} from "@/router/routesNames";
import {useGeolocation} from "@/composables/geolocation/useGeolocation";
import fetchingFirebase from "@/composables/fetchingFromFirestore";
import {GroupChat} from "@/model/chat/Chat";

const { takePhoto, photo } = usePhotoGallery();
const profileStore = useProfileStore()
const router = useRouter()
const {getCurrentPosition, checkPermissions, location} = useGeolocation()

const editedProfile = reactive<Profile>({date: "",
  handy: "",
  plan: "",
  temperament: "",
  thinking: "",
  description: "", id: "", name: "", place: {longitude:0,latitude:0}})

const loading = ref(false)

const buttonName = ref<string>("aktualizovat polohu")
const fetchFromFirebase = fetchingFirebase()

const validationValues = reactive({
  isUsernameEmpty: false,
  isDescriptionEmpty: false,
  notUniqueUsername: false,
  showErrorMessage: false
})

onIonViewWillEnter(()=>{
  setProfile()
})

onIonViewDidLeave(()=>{
  cleanPhoto()
  validationValues.showErrorMessage = false
  validationValues.isUsernameEmpty = false
  validationValues.isDescriptionEmpty = false
  validationValues.notUniqueUsername = false
})

function setProfile(){
  editedProfile.id = globalProfile.id
  editedProfile.date = globalProfile.date
  editedProfile.description = globalProfile.description
  editedProfile.name = globalProfile.name
  editedProfile.place = globalProfile.place
  editedProfile.handy = globalProfile.handy
  editedProfile.plan = globalProfile.plan
  editedProfile.temperament = globalProfile.temperament
  editedProfile.thinking = globalProfile.thinking
}

function cleanPhoto(){
  photo.value = undefined
}

async function getLocation(){
  buttonName.value = "načítání"
  const permissionResult = await checkPermissions()
  if (permissionResult === 'denied'){
    // TODO: upozorneni
    buttonName.value = "aktualizovat polohu"
  } else {
    await getCurrentPosition()
    if (location.value != undefined){
      editedProfile.place = {latitude: location.value.latitude, longitude: location.value.longitude}
      buttonName.value = "poloha zjištěna"

    } else {
      buttonName.value = "aktualizovat polohu"
    }
  }

}


async function saveChanges(){
  const validation = await validate(editedProfile.name)
  if(validation){
    loading.value = true
    // update in group chats
    if(editedProfile.name !== globalProfile.name){
      console.log("editedProfileName: ",editedProfile.name)
      console.log("globalProfileName: ",globalProfile.name)
      const groupChats = await fetchFromFirebase.getGroupChatByMemberName(globalProfile.name)
      console.log("group chats: ", groupChats)
      if(groupChats.length > 0){
        const updatedGroupChats = changeName(groupChats,editedProfile.name,globalProfile.name)
        console.log("updated group chats: ", updatedGroupChats)
        if(updatedGroupChats.length > 0){
          await updateInFirestore().updateNameInGroupChats(updatedGroupChats)
        }
      }
    }
    profileStore.setProfile(editedProfile)
    await (updateInFirestore().updateProfile(editedProfile))
    if(photo.value != undefined){
      await savePicture(photo.value)
    }
    await router.push({name:routesNames.Profile})
    loading.value = false
  } else {
    validationValues.showErrorMessage = true
  }

}

const now = computed(()=>{
  return new Date(Date.now())
})

const min = computed(()=>{
  return new Date(now.value.getFullYear() - 120,now.value.getMonth(),now.value.getDate()).toISOString()
})

const max = computed(()=>{
  return new Date(now.value.getFullYear() - 18,now.value.getMonth(),now.value.getDate()).toISOString()
})

async function validate(username: string): Promise<boolean> {
  validationValues.isUsernameEmpty = editedProfile.name.length < 1
  validationValues.isDescriptionEmpty = editedProfile.description.length < 1
  if(!validationValues.isDescriptionEmpty && !validationValues.isUsernameEmpty){
    if(username !== globalProfile.name){
      const profile = await fetchFromFirebase.isUsernameExist(username)
      if(profile){
        validationValues.notUniqueUsername = true
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  } else {
    return false
  }
}

function changeName(groupChats: GroupChat[], newName: string, oldName: string): GroupChat[] {

  groupChats.forEach((groupChat, index)=>{
    if(groupChat.membersNames.includes(oldName)){
      groupChats[index].membersNames = changeMemberNames(groupChat.membersNames,newName,oldName)
      groupChats[index].membersNamesAndIDs = changeMembersNamesAndIDs(groupChat.membersNamesAndIDs,newName,oldName)
    }
  })
  return groupChats
}

function changeMemberNames(memberNames: [string], newName: string, oldName: string): [string]{
  memberNames.forEach((name,index)=>{
    if(name === oldName){
      memberNames[index] = newName
    }
  })
  return memberNames
}
function changeMembersNamesAndIDs(memberNames: [string], newName: string, oldName: string): [string]{
  memberNames.forEach((name,index)=>{
    if(name.includes(oldName)){
      const id = name.slice(name.indexOf(";"), name.length)
      memberNames[index] = newName+id
    }
  })
  return memberNames
}

</script>

<style scoped>
ion-thumbnail {
  --size: 140px;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-style {
  width: 100%;
  height: 100%;
  color: #363636
}



</style>