<template>
  <ion-item @click="setSelectedSearchedGroup()" :button="true" v-if="isGroupSearched" style="padding-top: 0.4em">
    <ion-col style="padding-bottom: 0.8em">
      <ion-row class="ion-align-items-center">
        <ion-col class="ion-no-padding">
          <ion-row class="ion-align-items-center">
            <h5 :class="colors.colorClass" style="padding: 0;margin: 0">
              {{props.ownUser.useCase}}
            </h5>
            <p style="margin: 0; padding: 0 0 0 0.5em;" v-if="sportCase != ''">{{sportCase}}</p>
            <p style="padding: 0 0 0 0.5em;;margin: 0" v-else>{{workCase}}</p>
            <ion-col size="auto">
              <ion-icon :class="colors.colorClass" :icon="checkmark"></ion-icon>
            </ion-col>
          </ion-row>


        </ion-col>
      </ion-row>

      <ion-row class="ion-justify-content-between ion-align-items-center" >
        <div>
          <ion-row class="ion-align-items-center">
            <ion-icon :class="colors.colorClass" :icon="peopleOutline" style="padding-right: 0.5em"></ion-icon>
            <small> {{props.ownUser.groupName}} </small>
          </ion-row>
        </div>

      </ion-row>


    </ion-col>
    <ion-col size="auto">
      <div class="compatibility-circle">
          <ion-icon size="large" :src="colors.compatibilityIcon"></ion-icon>
          <div>{{compatibility}}</div>
      </div>
    </ion-col>
  </ion-item>


  <ion-item id="groups-searched-group-item-created" @click="setSelectedSearchedGroup()" :button="true" v-else style="padding-top: 0.4em">
    <ion-col class="ion-align-items-center" style="padding-bottom: 0.8em">
      <ion-row class="ion-justify-content-between ion-align-items-center ">
        <div>
          <ion-row class="ion-align-items-center">
            <h5 :class="colors.colorClass" style="padding: 0;margin: 0">
              {{props.ownUser.useCase}}
            </h5>
            <p style="margin: 0; padding: 0 0 0 0.5em;" v-if="sportCase != ''">{{sportCase}}</p>
            <p style="padding: 0 0 0 0.5em;;margin: 0" v-else>{{workCase}}</p>
          </ion-row>
        </div>

        <div>
          <ion-row class="ion-align-items-center">
            <div class="compatibility-circle">
              <ion-icon style="font-size:2em;" :src="colors.searchingGroupIcon"></ion-icon>
            </div>

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
import {computed, onBeforeMount, onMounted, ref} from "vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {globalSelectedSearchedGroup} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {OwnUser} from "@/model/group/ownUsersResponse";
import {convertCategory} from "@/composables/categoryConvertor";

const router = useRouter()

const sportCase = ref('')
const workCase = ref('')

const props = defineProps<{
  ownUser: OwnUser
}>()

onBeforeMount(()=>{
  const {workCaseThis, sportCaseThis} = convertCategory(props.ownUser.useCase, props.ownUser.category)
  sportCase.value = sportCaseThis
  workCase.value = workCaseThis
})

function setSelectedSearchedGroup(){
  const {workCaseThis, sportCaseThis} = convertCategory(props.ownUser.useCase, props.ownUser.category)
  const toUser: User = {
    color: props.ownUser.color, groupId: props.ownUser.groupId, groupName: props.ownUser.groupName,
    id: props.ownUser.id, sportCase: sportCaseThis, useCase: props.ownUser.useCase, userId: props.ownUser.userId,
    workCase: workCaseThis
  }
  Object.assign(globalSelectedSearchedGroup, toUser)
  router.push({name: routesNames.GroupMatching})
}



const isGroupSearched = computed(()=>{
  return props.ownUser.groupId != ''
})

const compatibility = computed(()=>{
  return `${props.ownUser.compatibility}%`
})


// CSS CLASSES
const colors = computed(()=>{
  switch (props.ownUser.color) {
    case colorsCases.Blue: {
      return {
        colorClass: "custom-blue",
        searchingGroupIcon: "/user/searching-group-icon-blue.svg",
        compatibilityIcon: "/compatibility/com-icon-blue.svg"
      }
    }
    case colorsCases.Green: {
      return {
        colorClass: "custom-green",
        searchingGroupIcon: "/user/searching-group-icon-green.svg",
        compatibilityIcon: "/compatibility/com-icon-green.svg"
      }

    }
    case colorsCases.Orange: {
      return {
        colorClass: "custom-orange",
        searchingGroupIcon: "/user/searching-group-icon-orange.svg",
        compatibilityIcon: "/compatibility/com-icon-orange.svg"
      }
    }
    case colorsCases.Red: {
      return {
        colorClass: "custom-dark-red",
        searchingGroupIcon: "/user/searching-group-icon-red.svg",
        compatibilityIcon: "/compatibility/com-icon-red.svg"
      }
    }
    default: {
      return {
        colorClass: "custom-blue",
        searchingGroupIcon: "/user/searching-group-icon-blue.svg",
        compatibilityIcon: "/compatibility/com-icon-blue.svg"
      }
    }
  }
})

</script>

<style scoped>
.compatibility-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.2em;
  border-radius: 50%;
  border-style: solid;
  border-width: 0.09em;
  border-color: #B0ABAB;
  width: 3em;
  height: 3em;
}

.compatibility-circle div {
  font-size: 0.8em;
}
</style>