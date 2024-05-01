<template>
  <ion-item id="groups-group-item" @click="setSelectedGroup()" :button="true">
    <ion-row style="width: 100%;" class="ion-justify-content-between">
      <ion-col size="9">
        <ion-row class="ion-align-items-center">
          <h5 :class="colors.colorClass" style="padding: 0;margin: 0">
            {{props.ownGroup.name}}
          </h5>
          <ion-icon style="padding: 0 0 0 0.5em" v-if="isMaxEqualToCurrent"  :class="colors.colorClass" :icon="checkmark"></ion-icon>
        </ion-row>

        <div class="right" style="padding-top: 0.4em">
          <small class="text"> {{props.ownGroup.description}} </small>
        </div>
        <ion-row class="ion-justify-content-between ion-padding-top">
          <div>
            <ion-row class="ion-align-items-center">
              <ion-icon :class="colors.colorClass" :icon="peopleOutline"></ion-icon>
              <small>{{ props.ownGroup.currentMembers }}/{{ props.ownGroup.maxMembers }}</small>
            </ion-row>
          </div>
        </ion-row>
      </ion-col>
      <ion-col size="auto" v-if="isCurrentMoreThanOne" style="display: flex; justify-content: end; align-items: center;">
          <div class="compatibility-circle">
            <ion-icon size="large" :src="colors.compatibilityIcon"></ion-icon>
            <div>{{compatibility}} </div>
          </div>
      </ion-col>
    </ion-row>
  </ion-item>
</template>

<script setup lang="ts">

import {Group} from "@/model/group/Group";
import {IonItem, IonIcon,IonCol, IonRow} from "@ionic/vue";
import {computed, onMounted, ref} from "vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {peopleOutline, checkmark} from 'ionicons/icons'
import {globalSelectedGroup} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";
import {OwnGroup} from "@/model/group/ownGroupsResponse";
import {convertCategory} from "@/composables/categoryConvertor";

const router = useRouter()

const props = defineProps<{
  ownGroup: OwnGroup
}>()



function setSelectedGroup(){
  const {workCaseThis,sportCaseThis} = convertCategory(props.ownGroup.useCase,props.ownGroup.category)
  const toGroup: Group = {
    color: props.ownGroup.color,
    currentMembers: props.ownGroup.currentMembers,
    description: props.ownGroup.description,
    id: props.ownGroup.id,
    maxMembers: props.ownGroup.maxMembers,
    membersIDs: props.ownGroup.membersIDs,
    name: props.ownGroup.name,
    sportCase: sportCaseThis,
    useCase: props.ownGroup.useCase,
    userId: props.ownGroup.userId,
    workCase: workCaseThis
  }
  Object.assign(globalSelectedGroup, toGroup)
  router.push({name: routesNames.UserMatching})
  // CLEAN AFTER RETURNING BACK?
}
//const isMaxEqualToCurrent = ref(false)

const isMaxEqualToCurrent = computed(()=>{
  return props.ownGroup.currentMembers === props.ownGroup.maxMembers
})

const compatibility = computed(()=>{
  return `${props.ownGroup.compatibility}%`
})

const isCurrentMoreThanOne = computed(()=>{
  return props.ownGroup.currentMembers > 1
})

// CSS CLASSES
const colors = computed(()=>{
  switch (props.ownGroup.color) {
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

.right {
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: column;
}

.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compatibility-circle {
  display: inline-flex;
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