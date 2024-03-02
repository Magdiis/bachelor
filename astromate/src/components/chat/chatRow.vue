<template>
   
        <ion-row class="row ion-align-items-center ion-nowrap">
        <ion-col size="auto">
            <span class="dot" >
                <ion-icon :icon="isOneProfile? personOutline : peopleOutline" 
                :class="returnColorClass +' '+ returnIconClass"  >
            </ion-icon></span>
        </ion-col>
        
        <ion-col class="right">
            <ion-row style="display: flex;">
                <h3 class="ion-no-margin text" :class="returnColorClass">Heading aefaefcaec e  sefsefsef</h3>
            </ion-row>
            <ion-row>
                <ion-label class="ion-margin-top text">
                    adadwadwawdd dawdawdawdawd awd awd awd awd awdaw
                </ion-label>
            </ion-row>
        </ion-col>
        </ion-row>

  
</template>

<script setup lang="ts">
import { colorsCases } from '@/model/createGroupEnums';
import {IonIcon, IonText,IonLabel, IonCol, IonGrid, IonRow, onIonViewDidEnter } from '@ionic/vue';
import {personOutline, peopleOutline, personRemoveSharp} from 'ionicons/icons'
import {computed } from 'vue'

 const props = defineProps<{
    isOneProfile: boolean,
    //nameOfGroup: string, 
    //namesOfProfiles: string[],
    color: colorsCases
}>() 

/* style="position: absolute; left: 1em; top: 3em;" */


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
 const returnIconClass = computed(()=>{
    if(props.isOneProfile){
        return "isOneProfile"
    } else {
        return "isMoreProfiles"
    }
 })


//const headingColor = computed<string>(() => {
//    return "text-magdik-blue"
//})

// const headingColor2 = computed(() => {
//     return {
//         color: "var(--ion-color-blue)"
//     }
// })
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