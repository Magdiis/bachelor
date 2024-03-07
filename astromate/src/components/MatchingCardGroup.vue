<template>
    <ion-card ref="card">
      <ion-card-header>
          <ion-card-title>
              {{ props.group.name }}
          </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item v-for="profile in props.profiles">
              {{ profile.name }}
          </ion-item>
        </ion-list>

        <ion-button fill="outline" @click="dislike()">
            Dislike
        </ion-button>
        <ion-button  @click="like()">
            Like
        </ion-button>
      </ion-card-content>
    </ion-card>
  </template>
  
  
  <script setup lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, onIonViewDidEnter,
IonGrid, IonRow, IonCol, IonButton, createAnimation,IonList, IonItem  } from '@ionic/vue';
  import type { Group } from '@/model/Group';
  import { useRouter } from 'vue-router';
  import {Profile} from "@/model/Profile";
  
  const router = useRouter()
  
  const props = defineProps<{
    group: Group,
    profiles: Profile[]
  }>()

  const emit = defineEmits(['like','dislike'])

  function like(){
    emit('like')
  }

  function dislike(){
    emit('dislike')
  }

//   const card = ref(null)
//   let rightAnimation: Animation
//   let leftAnimation: Animation
//
//   onMounted(()=>{
//     rightAnimation = createAnimation()
//           .addElement(card.value.$el)
//           .duration(200)
//           .iterations(Infinity)
//           .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
//           .fromTo('opacity', '1', '0.1');
//     leftAnimation = createAnimation()
//           .addElement(card.value.$el)
//           .duration(200)
//           .iterations(Infinity)
//           .fromTo('transform', 'translateX(0px)', 'translateX(-100px)')
//           .fromTo('opacity', '1', '0.1');
//
//   })
//
//   function delay(ms: number) {
//     return new Promise( resolve => setTimeout(resolve, ms) );
// }

 // async function Like() {
    // rightAnimation.play()
    // await delay(200);
    // rightAnimation.stop()
 // }

 // async function Dislike() {
    // leftAnimation.play()
    // await delay(200);
    // leftAnimation.stop()
  //}

  function leftAnimate(){
    
  }

  function rightAnimate(){

  }
  
  </script>
  
  
  <style scoped>
  
  </style>