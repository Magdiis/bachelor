<template>
  <ion-grid>
    <ion-row class="placing">
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
import {computed} from "vue";

const props = defineProps<{
  textMessage: TextMessage,
  color: string
}>()


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


</script>


<style scoped>

.placing {
  margin-right: 25%;
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


</style>