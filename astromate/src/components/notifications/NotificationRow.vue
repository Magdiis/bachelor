<template>
      <ion-grid>
    <!--sender id: {{props.notification.sender}} -->
        <ion-label>{{text}}</ion-label>
        <ion-row v-if="isButtons()">
            <ion-button fill="outline">
                Odmítnout
            </ion-button>
          <ion-button @click="
          accept(props.notification.sender,
          props.notification.receiver,
          props.notification.groupDocumentID,
          props.notification.userDocumentID,
          props.notification.senderName)">
            Přijmout
          </ion-button>
        </ion-row>
        <ion-row v-else>
          <ion-button @click="">
            Schovat
          </ion-button>
        </ion-row>
      </ion-grid>
</template>


<script setup lang="ts">

import {onIonViewWillEnter, IonRow,IonButton, IonGrid,IonLabel} from "@ionic/vue";
import {NotificationMessage, notificationNames, notificationText} from "@/model/notification/NotificationMessage";
import {onMounted, ref} from "vue";
import updateInFirestore from "@/composables/updateInFirestore";
import {globalProfile} from "@/composables/store/profileStore";

const props = defineProps<{
  notification: NotificationMessage,
}>()

const text = ref("")

function isButtons(): boolean{
  return !(props.notification.text === notificationText.UserAddedUser
      || props.notification.text === notificationText.UserRemovedUser);
}

onMounted(()=>{
  text.value = makeText(props.notification.text, props.notification.senderName, props.notification.groupName)
})

function makeText(textNumber: number, senderName: string, groupName: string): string{
  switch (textNumber) {
    case notificationText.UserRemovedUser:
      return "Uživatel vás odebral ze skupiny"
    case notificationText.UserAddedUser:
      return "Uživatel vás přidal do skupiny"
    case notificationText.UserWantsUserToHisGroup:
      return "Uživatel " + senderName +" vás pozval do skupiny "+ groupName
    case notificationText.UserWantsToUsersGroup:
      return "Uživatel " + senderName +" se chce připojit do skupiny "+ groupName
    default:
      return ""
  }
}

async function accept(senderId: string, receiverId: string, groupDocumentId: string,
                      userDocumentId: string, senderName: string){
  console.log("groupDocumentId ", groupDocumentId)
  console.log("userDocumentId ", userDocumentId)
  if (props.notification.text === notificationText.UserWantsToUsersGroup){
      await addMember(groupDocumentId,senderId)
      await addGroupId(userDocumentId,groupDocumentId)
      await addMemberToGroupChat(groupDocumentId, senderId, senderName)
  } else if (props.notification.text === notificationText.UserWantsUserToHisGroup){
      await addMember(groupDocumentId,receiverId)
      await addGroupId(userDocumentId,groupDocumentId)
      await addMemberToGroupChat(groupDocumentId, globalProfile.id, globalProfile.name)
  }
}


async function addMember(groupDocumentId: string, memberId: string){
  await (updateInFirestore().addMemberToGroup(groupDocumentId, memberId))
}

async function addGroupId(usersDocumentId: string, groupId: string){
  await (updateInFirestore().setGroupId(usersDocumentId, groupId))
}

async function addMemberToGroupChat(groupChatId: string,memberId: string, memberName: string ){
  await (updateInFirestore().addMemberToGroupChat(groupChatId,memberId,memberName))
}

</script>

<style scoped>

</style>