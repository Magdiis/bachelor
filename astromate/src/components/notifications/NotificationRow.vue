<template>
  <div :style="notificationMessageStyle" id="notification-item">
    <ion-item>
      <ion-grid v-if="isNotificationInfo ">
        <!--sender id: {{props.notification.sender}} -->
      <ion-row class="ion-align-items-center">
        <ion-col size="auto">
          <ion-icon size="large" :src="notificationValues.icon"> </ion-icon>
        </ion-col>
        <ion-col>
          Uživatel <b>{{notificationValues.sender}}</b> {{notificationValues.action}} <b>{{notificationValues.groupName}}</b>
        </ion-col>
      </ion-row>
        <ion-row>
          <ion-col size="auto">
            <ion-icon size="large"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-button size="small" color="danger" style=" padding-right: 1em" shape="round" @click="decline(props.notification)" fill="outline">
              Odmítnout
            </ion-button>
            <ion-button id="notification-item-accept-button" size="small" color="success" shape="round" fill="outline" @click="
          accept(props.notification.sender,
          props.notification.receiver,
          props.notification.groupDocumentID,
          props.notification.userDocumentID,
          props.notification.senderName,
          props.notification)">
              Přijmout
            </ion-button>
          </ion-col>

        </ion-row>
      </ion-grid>

      <ion-grid v-else>
        <ion-row class="ion-align-items-center">
          <ion-col size="auto">
            <ion-icon color="primary" size="large" :icon="notificationValues.icon"></ion-icon>
          </ion-col>
          <ion-col>
            Uživatel <b>{{notificationValues.sender}}</b> {{notificationValues.action}} <b>{{notificationValues.groupName}}</b>
          </ion-col>
          <ion-col size="auto" style="color: #707070">
              <ion-icon @click="decline(props.notification)"  size="large" :icon="closeOutline" ></ion-icon>
          </ion-col>
        </ion-row>
      </ion-grid>

    </ion-item>
  </div>

</template>


<script setup lang="ts">

import {IonCol,IonIcon, IonRow,IonButton, IonGrid,IonLabel, createAnimation, IonItem} from "@ionic/vue";
import {NotificationMessage, notificationNames, notificationText} from "@/model/notification/NotificationMessage";
import {computed, onMounted, ref} from "vue";
import updateInFirestore from "@/composables/updateInFirestore";
import {globalProfile} from "@/composables/store/profileStore";
import {closeOutline, informationCircleOutline} from "ionicons/icons";
import type { Animation } from '@ionic/vue';

const props = defineProps<{
  notification: NotificationMessage,
}>()


const notificationMessageStyle = ref<Partial<CSSStyleDeclaration>>({})
const firestoreUpdate = updateInFirestore()


const isNotificationInfo = computed(()=>{
  return props.notification.text === notificationText.UserWantsToUsersGroup || props.notification.text === notificationText.UserWantsUserToHisGroup
})



onMounted(()=>{
  notificationMessageStyle.value.animationName=''
})

const notificationValues = computed(()=>{
  var notification = {
    sender: props.notification.senderName,
    groupName: props.notification.groupName,
    action: "",
    icon: ""
  }
  switch (props.notification.text){
    case notificationText.UserRemovedUser:
        notification.action = "vás odebral ze skupiny"
        notification.icon = informationCircleOutline
        return notification
    case notificationText.UserAddedUser:
      notification.action = "vás přidal do skupiny"
      notification.icon = informationCircleOutline
      return notification
    case notificationText.UserLeaveGroup:
      notification.action = "opustil vaší skupinu"
      notification.icon = informationCircleOutline
      return notification
    case notificationText.UserWantsUserToHisGroup:
      notification.action = "vás pozval do skupiny"
      notification.icon = "/user/searching-group-icon-blue.svg"
      return notification

    case notificationText.UserWantsToUsersGroup:
      notification.action = "se chce připojit do skupiny"
      notification.icon = "/user/user-request-icon.svg"
      return notification

    case notificationText.UserDeleteGroup:
      notification.action = "smazal svojí skupinu"
      notification.icon = informationCircleOutline
      return notification
    default:
      return notification
  }
})

async function accept(senderId: string, receiverId: string, groupDocumentId: string,
                      userDocumentId: string, senderName: string, notification: NotificationMessage){

  animate()
  setTimeout(async ()=>{
    props.notification.toBeDeleted = true
    if (props.notification.text === notificationText.UserWantsToUsersGroup){
      await addMember(groupDocumentId,senderId)
      await addGroupIdAndName(userDocumentId,groupDocumentId,notification.groupName)
      await addMemberToGroupChat(groupDocumentId, senderId, senderName)
      await firestoreUpdate.readNotification(notification)

    } else if (props.notification.text === notificationText.UserWantsUserToHisGroup){
      await addMember(groupDocumentId,receiverId)
      await addGroupIdAndName(userDocumentId,groupDocumentId,notification.groupName)
      await addMemberToGroupChat(groupDocumentId, globalProfile.id, globalProfile.name)
      await firestoreUpdate.readNotification(notification)

    }
  },500)


}

async function decline(notification: NotificationMessage){
  animate()
  setTimeout(async ()=>{
    props.notification.toBeDeleted = true
    notificationMessageStyle.value.animationName=''
    await firestoreUpdate.readNotification(notification)
  },500)
}


async function addMember(groupDocumentId: string, memberId: string){
  await (updateInFirestore().addMemberToGroup(groupDocumentId, memberId))
}

async function addGroupIdAndName(usersDocumentId: string, groupId: string, groupName: string){
  await (updateInFirestore().setGroupId(usersDocumentId, groupId,groupName))
}

async function addMemberToGroupChat(groupChatId: string,memberId: string, memberName: string ){
  await (updateInFirestore().addMemberToGroupChat(groupChatId,memberId,memberName))
}

function animate(){

  notificationMessageStyle.value.position = 'relative'
  notificationMessageStyle.value.animationName='notificationRight'
  notificationMessageStyle.value.animationTimingFunction='ease-in'
  notificationMessageStyle.value.animationDuration= '500ms'
}

</script>

<style scoped>


</style>