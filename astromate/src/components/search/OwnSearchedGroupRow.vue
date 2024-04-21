<template>
  <ion-item @click="setSelectedSearchedGroup()" :button="true" v-if="isGroupSearched">
    <ion-col>
      <ion-row class="ion-align-items-center">
        <ion-col size="auto">
          <ion-icon  :class="returnColorClass" :icon="checkmark"></ion-icon>
        </ion-col>
        <ion-col>
          <h5 :class="returnColorClass" style="padding: 0;margin: 0">
            {{props.user.useCase}}
          </h5>
          <p style="padding: 0;margin: 0" v-if="props.user.sportCase != ''">{{props.user.sportCase}}</p>
          <p style="padding: 0;margin: 0" v-else>{{props.user.workCase}}</p>
        </ion-col>
      </ion-row>

      <ion-row class="ion-justify-content-between ion-padding-top">
        <div>
          <ion-row class="ion-align-items-center">
            <ion-icon size="large" :class="returnColorClass" :icon="peopleOutline"></ion-icon>
            jmeno
          </ion-row>
        </div>
        <div >
          <ion-row class="ion-align-items-center">
            <ion-icon size="large" :class="returnColorClass" :icon="peopleOutline"></ion-icon>
            {{compatibility}}
          </ion-row>
        </div>
      </ion-row>
    </ion-col>
  </ion-item>


  <ion-item @click="setSelectedSearchedGroup()" :button="true" v-else>
    <ion-col class="ion-align-items-center">
      <ion-row class="ion-justify-content-between ion-align-items-center ">
        <div>
          <ion-col style="padding: 0;margin: 0">
            <ion-row class="ion-align-items-center">
              <h5 :class="returnColorClass" style="padding: 0;margin: 0">{{props.user.useCase}} </h5>
            </ion-row>
            <p style="padding: 0;margin: 0" v-if="props.user.sportCase != ''">{{props.user.sportCase}}</p>
            <p style="padding: 0;margin: 0" v-else>{{props.user.workCase}}</p>
          </ion-col>

        </div>
        <div>
          <ion-row class="ion-align-items-center">
            <ion-icon style="font-size:2em;" :src="searchingGroupIcon"></ion-icon>
          </ion-row>
        </div>
      </ion-row>
    </ion-col>
  </ion-item>
</template>

<script setup lang="ts">

import {User} from "@/model/group/User";
import {IonCol, IonIcon, IonItem, IonRow} from "@ionic/vue";
import {checkmark, peopleOutline} from "ionicons/icons";
import {computed} from "vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {globalSelectedSearchedGroup} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps<{
  user: User
}>()

function setSelectedSearchedGroup(){
  Object.assign(globalSelectedSearchedGroup, props.user)
  router.push({name: routesNames.GroupMatching})
}



const isGroupSearched = computed(()=>{
  return props.user.groupId != ''
})

const compatibility = computed(()=>{
  return '78%'
})


// CSS CLASSES
const returnColorClass = computed(() => {
  switch (props.user.color) {
    case colorsCases.Blue: {
      return "custom-blue"
    }
    case colorsCases.Green: {
      return "custom-green"
    }
    case colorsCases.Orange: {
      return "custom-orange"
    }
    case colorsCases.Red: {
      return "custom-dark-red"
    }
    default: {
      return "custom-dark-red"
    }
  }
})

const searchingGroupIcon = computed(()=>{
  switch (props.user.color) {
    case colorsCases.Blue: {
      return "/user/searching-group-icon-blue.svg"
    }
    case colorsCases.Green: {
      return "/user/searching-group-icon-green.svg"
    }
    case colorsCases.Orange: {
      return "/user/searching-group-icon-orange.svg"
    }
    case colorsCases.Red: {
      return "/user/searching-group-icon-red.svg"
    }
    default: {
      return "/user/searching-group-icon-blue.svg"
    }
  }
})
</script>

<style scoped>

</style>