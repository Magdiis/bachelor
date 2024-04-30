<template>
  <ion-row class="ion-align-items-center chat-page-member-item">
    <ion-col size="auto" style="height: 3.6em; width: 3.6em">
      <div class="dot" v-if="img.src == ''">
        <ion-icon size="large" style="color: #e7e7e7" :icon="person"></ion-icon>
      </div>
      <img v-else :src="img.src"  style="border-radius: 50%; height: 3em; width: 3em"></img>
    </ion-col>
    <ion-col>
      <h6> {{name}}</h6>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">


import {computed, ComputedRef, onMounted, reactive} from "vue";
import {person} from "ionicons/icons";
import {IonIcon, IonRow, IonCol} from "@ionic/vue";
import useStorage from "@/composables/firebaseStorage/useStorage";

const firebaseStorage = useStorage()

onMounted(async ()=>{
  const id = props.idAndName.substring(props.idAndName.indexOf(";")+1, props.idAndName.length )
  await getPhoto(id)
})

const img = reactive({
  src: ""
})

const props = defineProps<{
  idAndName: string,
}>()

const name = computed(()=>{
  return props.idAndName.substring(0, props.idAndName.indexOf(";"))
})


async function getPhoto(id: string){
  const response = await firebaseStorage.getPhoto(id)
  if (response.URL != undefined){
    img.src = response.URL
  }
}


</script>

<style scoped>

</style>