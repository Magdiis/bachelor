import {reactive, ref} from "vue";
import {onSnapshot, query, Query, where} from "firebase/firestore";
import {notification_collection} from "@/firebase-service";
import {globalProfile} from "@/composables/store/profileStore";
import {NotificationMessage} from "@/model/notification/NotificationMessage";


export const isNotificationEmpty = ref(false)

export const globalNotifications = ref<NotificationMessage[]>([])

let unsubscribe = null as null|Function

export function listenNotifications(){
    const q : Query = query(notification_collection,where("receiver","==", globalProfile.id),where("read","==",false))
    unsubscribe = onSnapshot(q, (querySnapshot)=>{
        // processNotifications(querySnapshot)
        globalNotifications.value = []
        querySnapshot.forEach((doc) => {
            globalNotifications.value.push({
                groupName: doc.data().groupName,
                senderName: doc.data().senderName,
                id: doc.id,
                read: doc.data().read,
                sentAt: doc.data().sentAt,
                text: doc.data().text,
                sender: doc.data().sender,
                receiver: doc.data().receiver,
                groupDocumentID: doc.data().groupDocumentID,
                userDocumentID: doc.data().userDocumentID,
                toBeDeleted: false
            })
        })
        isNotificationEmpty.value = globalNotifications.value.length < 1
    }, (error) => {
        console.error("Error fetching notifications: ",error)
    })
}

export function stopListeningToNotifications(){
    if(unsubscribe){
        unsubscribe()
    }
}