<template>
  <ion-row style="margin: 0; padding: 0"  class="ion-align-items-center">
    <div class="dot" :class="colorOfDot">
      <ion-icon style="padding: 0; margin: 0; font-size: 1.6em" :icon="getIcon"></ion-icon>
    </div>
    <p  style="padding-left: 0.6em"> {{props.character}}</p>
  </ion-row>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {Handy, Plan, Temperament, temperamentValues, Thinking} from "@/model/profile/Profile";
import { peopleOutline, constructOutline, calendarNumberOutline, heartOutline} from "ionicons/icons";
import {ioniconContent} from "ionicons/dist/types/components/icon/request";
import {IonIcon, IonRow} from "@ionic/vue";
import {colorsCases} from "@/model/group/createGroupEnums";



const props = defineProps<{
  character: string,
  color: colorsCases
}>()

const getIcon = computed(()=>{
  if (props.character === Temperament.introvert || props.character === Temperament.extrovert){
    return peopleOutline
  } else if (props.character === Thinking.emotional || props.character === Thinking.rational){
    return heartOutline
  } else if (props.character === Plan.plan || props.character === Plan.chaos) {
    return calendarNumberOutline
  } else if (props.character === Handy.handy || props.character === Handy.creative){
    return constructOutline
  }

})


const colorOfDot = computed(()=>{
  switch (props.color) {
    case colorsCases.Blue:
      return "dot-blue"
    case colorsCases.Green:
      return "dot-green"
    case colorsCases.Orange:
      return "dot-orange"
    case colorsCases.Red:
      return "dot-red"
  }
})

</script>

<style scoped>
.dot {
  height: 2.8em;
  width: 2.8em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot-blue {
  background-color: var(--ion-color-blue-lighter);
}
.dot-green {
  background-color: var(--ion-color-green-lighter);
}
.dot-red {
  background-color: var(--ion-color-darkRed-lighter);
}
.dot-orange {
  background-color: var(--ion-color-orange-lighter);
}
</style>