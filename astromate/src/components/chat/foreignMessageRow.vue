<template>
  <ion-grid>
    <ion-row class="placing ion-align-items-center">
      <ion-col size="auto">
        <div class="dot" v-if="img.src == ''">
          <ion-icon size="large" style="color: #e7e7e7" :icon="person"></ion-icon>
        </div>
        <img v-else :src="img.src"  style="border-radius: 50%; height: 3em; width: 3em"></img>
      </ion-col>
      <ion-col  class="messageBackground">
        <ion-row class="ion-align-items-center">
           <ion-text class="name-typography" :class="returnColorClass">
             <small>  {{name}} </small>
           </ion-text>
          <ion-col style="padding: 0px"><div class="ion-text-right"> <ion-text class="timeText"> <small> {{time}}</small> </ion-text> </div> </ion-col>
        </ion-row>
        <ion-text>{{ textMessage.messageText }} </ion-text>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {TextMessage} from "@/model/chat/Chat";
import {colorsCases} from "@/model/group/createGroupEnums";
import {IonIcon, IonText,IonLabel, IonCol, IonGrid, IonRow, onIonViewDidEnter } from '@ionic/vue';
import {computed, onMounted, reactive, ref} from "vue";
import {globalProfile, globalProfilePhotoURl} from "@/composables/store/profileStore";
import useStorage from "@/composables/firebaseStorage/useStorage";
import {person} from "ionicons/icons";


const firebaseStorage = useStorage()
const props = defineProps<{
  textMessage: TextMessage,
  color: string
}>()

const img = reactive({
  src: ""
})

onMounted(async ()=>{
  await getPhoto(props.textMessage.sentById)
})

const time = computed(()=>{
  const timeString = props.textMessage.sentAt.toDate().toLocaleTimeString()
  return timeString.substring(0, timeString.length - 3)
})

const name = computed(()=>{
  return props.textMessage.sentByName
})

// COMPUTED CSS CLASSES
const returnColorClass = computed(() => {
  switch(props.color) {
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
      //statements;
      break;
    }
  }
})

async function getPhoto(id: string){
  const response = await firebaseStorage.getPhoto(id)
  if (response.URL != undefined){
    img.src = response.URL
  }
}


</script>


<style scoped>

.placing {
  margin-right: 10%;
  padding: 0.2em
}

.messageBackground {
  border: solid #e7e7e7;
  border-radius: 12px;
  padding: 0.4em 0.8em;
}


.timeText {
  color: #8d8d8d;
  font-weight: lighter;
}

.name-typography {
  font-weight: bold;
}

.dot {
  height: 3em;
  width: 3em;
  background-color: #fff;
  border-radius: 50%;
  border-style: solid;
  border-width: 0.09em;
  border-color: #e7e7e7;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>