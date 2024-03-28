<template>
<ion-grid>
  <ion-row class="placing">
      <ion-col :class="colorOfMessageBackground" class="messageBackground" >
        <ion-row class="paddingTimeAndMessage" >
          <ion-col class="clearPadding">
            <small class="timeText">
              <div class="ion-text-right" >
                {{time}}
              </div>
            </small>
          </ion-col>
        </ion-row>
        <ion-text >{{ textMessage.messageText }} </ion-text>
      </ion-col>
  </ion-row>
</ion-grid>
</template>

<script setup lang="ts">

import {TextMessage} from "@/model/chat/Chat";
import {colorsCases} from "@/model/group/createGroupEnums";
import {computed} from "vue";
import {globalProfile} from "@/composables/store/profileStore";
import {IonIcon, IonText,IonLabel, IonCol, IonGrid, IonRow, onIonViewDidEnter } from '@ionic/vue';
import {Timestamp} from "firebase/firestore";

const props = defineProps<{
  textMessage: TextMessage,
  color: string
}>()


const time = computed(()=>{
  const timeString = props.textMessage.sentAt.toDate().toLocaleTimeString()
  return timeString.substring(0, timeString.length - 3)
})


// COMPUTED CSS CLASSES
const colorOfMessageBackground = computed(()=>{
  switch(props.color) {
    case colorsCases.Blue: {
      return "messageBackgroundBlue";
    }
    case colorsCases.Red: {
      return "messageBackgroundRed";
    }
    case colorsCases.Green: {
      return "messageBackgroundGreen";
    }
    case colorsCases.Orange: {
      return "messageBackgroundOrange";
    }
    default: {
      break;
    }
  }
})

</script>

<style scoped>
.placing {
  margin-left: 25%;
  padding: 0.2em
}

.messageBackground {
  border-radius: 12px;
  padding: 0.6em 0.9em;
}

.paddingTimeAndMessage {
  padding: 0px 0px 0.2em;
}

.clearPadding {
  padding: 0px;
}

.timeText {
  color: #8d8d8d;
  font-weight: lighter
}

.messageBackgroundBlue {
  background: var(--ion-color-blue-light);
}
.messageBackgroundRed{
  background: var(--ion-color-darkRed-light);
}
.messageBackgroundGreen{
  background: var(--ion-color-green-light);
}
.messageBackgroundOrange{
  background: var(--ion-color-orange-light);
}

</style>