<template>
  <ion-item @click="setSelectedGroup()" :button="true">
    <ion-col>
      <ion-row class="ion-align-items-center">
        <ion-icon v-if="isMaxEqualToCurrent" size="large" :class="returnColorClass" :icon="checkmark"></ion-icon>
        <h5 :class="returnColorClass" style="padding: 0;margin: 0">
          {{props.group.name}}
        </h5>
      </ion-row>
      <div>
        <small> {{props.group.description}} </small>
      </div>
      <ion-row class="ion-justify-content-between ion-padding-top">
        <div>
          <ion-row class="ion-align-items-center">
            <ion-icon size="large" :class="returnColorClass" :icon="peopleOutline"></ion-icon>
            {{ props.group.currentMembers }}/{{ props.group.maxMembers }}
          </ion-row>
        </div>
        <div  v-if="isCurrentMoreThanOne">
          <ion-row class="ion-align-items-center">
            <ion-icon size="large" :class="returnColorClass" :icon="peopleOutline"></ion-icon>
            {{compatibility}}
          </ion-row>
        </div>
      </ion-row>
    </ion-col>
  </ion-item>
</template>

<script setup lang="ts">

import {Group} from "@/model/group/Group";
import {IonItem, IonIcon,IonCol, IonRow} from "@ionic/vue";
import {computed, ref} from "vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {peopleOutline, checkmark} from 'ionicons/icons'
import {globalSelectedGroup} from "@/composables/store/useGroupStore";
import {routesNames} from "@/router/routesNames";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps<{
  group: Group
}>()

function setSelectedGroup(){
  Object.assign(globalSelectedGroup, props.group)
  router.push({name: routesNames.UserMatching})
  // CLEAN AFTER RETURNING BACK?
}
//const isMaxEqualToCurrent = ref(false)

const isMaxEqualToCurrent = computed(()=>{
  return props.group.currentMembers === props.group.maxMembers
})

const compatibility = computed(()=>{
  return '78%'
})

const isCurrentMoreThanOne = computed(()=>{
  return props.group.currentMembers > 1
})

// CSS CLASSES
const returnColorClass = computed(() => {
  switch (props.group.color) {
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
</script>

<style scoped>

</style>