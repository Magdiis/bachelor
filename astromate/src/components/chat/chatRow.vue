<template>
        <ion-row class="row ion-align-items-center ion-nowrap"
                 @click="navigateToChatPage(props.groupChat.id, props.groupChat.name, props.groupChat.color)">
        <ion-col size="auto">
            <span class="dot" >
                <ion-icon :icon="isPerson ? personOutline : peopleOutline"
                :class="returnColorClass +' '+ returnIconClass"  >
            </ion-icon></span>
        </ion-col>
        
        <ion-col class="right">
            <ion-row style="display: flex;">
                <h3 class="ion-no-margin text" :class="returnColorClass">
                  {{returnHeadlineName}}
                </h3>
            </ion-row>
            <ion-row>
                <ion-label class="ion-margin-top text">
                  {{returnNames}}
                </ion-label>
            </ion-row>
        </ion-col>
        </ion-row>
</template>

<script setup lang="ts">
import { colorsCases } from '@/model/group/createGroupEnums';
import {IonIcon, IonText,IonLabel, IonCol, IonGrid, IonRow, onIonViewDidEnter } from '@ionic/vue';
import {personOutline, peopleOutline, personRemoveSharp} from 'ionicons/icons'
import {computed } from 'vue'
import {ChatParams, GroupChat} from "@/model/chat/Chat";
import {globalProfile} from "@/composables/store/profileStore";
import router from "@/router";
import {routesNames} from "@/router/routesNames";


//TODO: in props - GroupChat, isOwner?
 const props = defineProps<{
    groupChat: GroupChat
}>() 

/* style="position: absolute; left: 1em; top: 3em;" */


 const returnColorClass = computed(() => {
    switch(props.groupChat.color) {
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
 const returnIconClass = computed(()=>{
    if(props.groupChat.isPairs){
        return "isOneProfile"
    } else {
        return "isMoreProfiles"
    }
 })

const returnNames = computed(()=>{
  var names = ""
  var namesArray = []
  namesArray = props.groupChat.membersNames.filter((name)=> {return name !== globalProfile.name })

  namesArray.forEach((name)=>{
    names += name + ", "
  })
  names = names.slice(0,-2)
  return names
})

const returnHeadlineName = computed(()=>{
  return props.groupChat.name
})

const isPerson = computed(()=>{
  return props.groupChat.isPairs
})
//const headingColor = computed<string>(() => {
//    return "text-magdik-blue"
//})

// const headingColor2 = computed(() => {
//     return {
//         color: "var(--ion-color-blue)"
//     }
// })

function navigateToChatPage(id: string, name: string, color: string){
  var chatParams: ChatParams = {
    id: id, name: name, color: color
  }
  var chatParamsString = JSON.stringify(chatParams)

  router.push({name: routesNames.ChatPage, params:{
    chatParams: chatParamsString
    }})
}

</script>

<style scoped>
.dot {
  height: 4em;
  width: 4em;
  background-color: #fff;
  border-radius: 50%;
  border-style: solid;
  border-width: 0.09em;
  border-color: #B0ABAB;
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-icon.isOneProfile{
  font-size: 1.8em;
  --ionicon-stroke-width: 32px;
}

ion-icon.isMoreProfiles{
    font-size: 2.4em;
    --ionicon-stroke-width: 26px;
}

.ion-margin-top{
    margin-top: 8px  /*default 16px */
}
.row {
  display: flex;
  align-items: center;
  width: 100%;
}


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
</style>