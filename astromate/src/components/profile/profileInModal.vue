<template>
  <div :style="imgStyle"  v-if="imgStyle.background != '' "></div>
  <ion-skeleton-text :animated="true" style="height: 100vw" v-else></ion-skeleton-text>

  <div class="ion-padding-horizontal ion-padding-bottom">
    <h3>{{profile.name}}, {{countAge(profile.date)}}</h3>
    <h6 style="background-color: var(--ion-color-blue-lighter);padding: 1em; border-radius: 12px">{{profile.description}}</h6>
    <div style="padding-top: 1em;">
      <scrolling-characteristics
          :temperament="profile.temperament"
          :handy="profile.handy"
          :plan="profile.plan"
          :thinking="profile.thinking"
          :color="colorsCases.Blue"></scrolling-characteristics>
    </div>

  </div>
</template>
<script setup lang="ts">

import {Profile} from "@/model/profile/Profile";
import {locationOutline} from "ionicons/icons";
import {IonIcon, IonRow, IonSkeletonText} from "@ionic/vue";
import {onMounted, ref} from "vue";
import {globalProfile, globalProfilePhotoURl} from "@/composables/store/profileStore";
import useStorage from "@/composables/firebaseStorage/useStorage";
import {colorsCases} from "@/model/group/createGroupEnums";
import ScrollingCharacteristics from "@/components/profile/scrollingCharacteristics.vue";

const firebaseStorage = useStorage()
const props = defineProps<{
  profile: Profile
}>()

onMounted(async ()=>{
  await getPhoto()
})
const imgStyle = ref<Partial<CSSStyleDeclaration>>({
  background: "",
  height: '100vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

async function getPhoto(){
  const response = await firebaseStorage.getPhoto(props.profile.id)
  if (response.URL != undefined){
    imgStyle.value.background = `url("${response.URL}")`
  }
}

function countAge(birthday: string): string{
  const now = new Date(Date.now())

  const birthdayDate = new Date(birthday)
  return (now.getFullYear() - birthdayDate.getFullYear()).toString()
}

</script>


<style scoped>
ion-skeleton-text {
  margin-top: 0;
  margin-bottom: 0;
}

</style>