<template>
        <div style="overflow: auto">
        <ion-row class="ion-nowrap" style="width: 200%; " v-if="preparedCharacteristics.length > 0" >
          <ion-col class="ion-padding-end" size="auto" style="height: 4em; padding-left: 0; padding-top: 0; padding-bottom: 0" v-for="ch in preparedCharacteristics">
            <characteristics-chip :color="color" :character="ch"></characteristics-chip>
          </ion-col>
        </ion-row>
        </div>
</template>

<script setup lang="ts">
import {IonRow, IonCol} from "@ionic/vue";
import {computed} from "vue";
import CharacteristicsChip from "@/components/profile/characteristicsChip.vue";
import {colorsCases} from "@/model/group/createGroupEnums";

const props = defineProps<{
  handy: string,
  plan: string,
  temperament: string,
  thinking: string,
  color: colorsCases
}>()

const color = computed(()=>{
  console.log(color)
  return props.color
})

const preparedCharacteristics = computed(()=>{
  const all = [props.plan, props.handy,props.temperament,props.thinking]
  return all.filter((ch) => {
    return ch !== ''
  })
})
</script>

<style scoped>

</style>