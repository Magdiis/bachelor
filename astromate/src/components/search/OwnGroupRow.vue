<template>
  <ion-item @click="setSelectedGroup()" :button="true">
    <ion-row style="width: 100%;" class="ion-justify-content-between">
      <ion-col size="9">
        <ion-row class="ion-align-items-center">
          <h5 :class="returnColorClass" style="padding: 0;margin: 0">
            {{props.group.name}}
          </h5>
          <ion-icon style="padding: 0 0 0 0.5em" v-if="isMaxEqualToCurrent"  :class="returnColorClass" :icon="checkmark"></ion-icon>
        </ion-row>

        <div class="right" style="padding-top: 0.4em">
          <small class="text"> {{props.group.description}} </small>
        </div>
        <ion-row class="ion-justify-content-between ion-padding-top">
          <div>
            <ion-row class="ion-align-items-center">
              <ion-icon :class="returnColorClass" :icon="peopleOutline"></ion-icon>
              <small>{{ props.group.currentMembers }}/{{ props.group.maxMembers }}</small>
            </ion-row>
          </div>
        </ion-row>
      </ion-col>
      <ion-col size="auto" v-if="isCurrentMoreThanOne" style="display: flex; justify-content: end; align-items: center;">
          <div class="compatibility-circle">
            <ion-icon size="large" :icon="peopleOutline"></ion-icon>
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
  console.log(props.group.color)
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