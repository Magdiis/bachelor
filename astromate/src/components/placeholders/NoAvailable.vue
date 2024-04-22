<template>
  <div class="center ion-padding" v-if="props.noGroupsAvailable">
    <ion-icon style="font-size:19em" :src="iconNoAvailable"></ion-icon>
    <h1 style="font-weight: bold">Žádné skupiny k dispozici</h1>
    <h4>Momentálně nejsou k dispozici žádné skupiny v této kategorii. Zkuste to prosím později.</h4>
  </div>
  <div class="center ion-padding" v-else>
    <ion-icon style="font-size:19em" :src="iconNoAvailable"></ion-icon>
    <h1 style="font-weight: bold">Žádní uživatelé k dispozici</h1>
    <h4>Momentálně nejsou k dispozici žádní uživatelé v této kategorii. Zkuste to prosím později.</h4>
  </div>
</template>

<script setup lang="ts">
import {IonIcon, IonCol, IonRow} from "@ionic/vue";
import {colorsCases} from "@/model/group/createGroupEnums";
import {computed} from "vue";
const props = defineProps<{
  noGroupsAvailable: boolean,
  color: colorsCases
}>()

const iconNoAvailable = computed(()=>{
  switch (props.color) {
    case colorsCases.Red:
      return "/placeholders/no-available-red.svg"
    case colorsCases.Orange:
      return "/placeholders/no-available-orange.svg";
    case colorsCases.Green:
      return "/placeholders/no-available-green.svg";
    case colorsCases.Blue:
      return "/placeholders/no-available-blue.svg";
    default:
      return "/placeholders/no-available-blue.svg";
  }
})

</script>


<style scoped>


.center_two {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}



</style>