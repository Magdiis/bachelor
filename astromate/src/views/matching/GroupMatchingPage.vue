<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="#" @click="router.back"></ion-back-button>
        </ion-buttons>
        <ion-title>Group matching</ion-title>
      </ion-toolbar>
    </ion-header>
        <ion-content :fullscreen="true">
            {{ currentGroup?.userId }}
            groups
            
            
        </ion-content>
    </ion-page>
    </template>
    
    <script setup lang="ts">
    import { IonPage, IonContent, IonTitle, 
    IonHeader, IonToolbar,IonButtons, IonBackButton, 
    IonButton, IonRow, IonCol, IonGrid, onIonViewDidEnter} from '@ionic/vue';
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import fetchingFromFirestore from '@/composables/fetchingFromFirestore'
    import type { Group } from '@/model/Group';
    import { ref, reactive } from 'vue';
import { SportCases, useCase, workCases } from '@/model/createGroupEnums';
import { closeOutline } from 'ionicons/icons';
    
    const router = useRouter()
    const route = useRoute()

    const groups = ref<Array<Group>>([])
    
    const currentGroup = ref<Group>()
    

    onIonViewDidEnter(async()=>{
        getGroupFromParams()
        fetchOthersGroups()
    })

    async function fetchOthersGroups() {
        var userID = localStorage.getItem("userID")
        if (userID == null){
            userID = ""
        }
        if (currentGroup.value != undefined) {
            const groupsFromFirebase = await fetchingFromFirestore().getOthersGroups(
                userID, currentGroup.value.useCase, currentGroup.value.workCase, 
                currentGroup.value.sportCase)
                groups.value = []
                groups.value = groupsFromFirebase
                groups.value.forEach(group => {
                    console.log(group + "\n")
                });
        }
        
    }

    function getGroupFromParams() {
        const groupParam = route.params.group 
        currentGroup.value = JSON.parse(groupParam.toString())
    }
    </script>
    
    <style scoped>
    
    </style>