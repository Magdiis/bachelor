import {doc, deleteDoc, collection, query, getDocs, where,} from "firebase/firestore";
import {db} from "@/firebase-service";

export default function deletingInFirestore(){
    async function deleteMessages(chatId: string){
        // TODO: try writeBatch

        // FIRST DELETED ALL MESSAGES FROM SUBCOLLECTION. THEN DELETED CHAT
        const path = "chats/"+chatId+"/messages"
        const q = query(collection(db,path))
        try {
            const querySnapshot = await getDocs(q)
            for (const message of querySnapshot.docs){
                await deleteDoc(doc(db,path,message.id))
            }
            await deleteDoc(doc(db,"chats",chatId))
        } catch (e) {
            console.error("error with deleting chat", e)
        }
    }

    async function deleteGroupChat(groupChatId:string){
        try {
            await deleteDoc(doc(db, "groupChat",groupChatId))
            console.log("delete group chat with id ", groupChatId)
        } catch (e) {
            console.error("error with delete group chat document", e)
        }
    }

    async function deleteGroup(groupId: string){
        try {
            await deleteDoc(doc(db,"groups",groupId))
            console.log("delete doc in groups with id ", groupId)
            await deleteGroupChat(groupId)
            await deleteMessages(groupId)
        } catch (e) {
            console.error("error with delete group document", e)
        }
    }


    async function deleteSearchedGroup(searchedGroupId: string){
        try {
            await deleteDoc(doc(db,"users",searchedGroupId))
        } catch (e) {
            console.error("error with delete searched group document", e)
        }
    }

    async function deleteNotification(notificationId: string){
        try {
            await deleteDoc(doc(db,"notifications", notificationId))
        } catch (e) {
            console.error("error with delete searched group document", e)
        }
    }

    return {
        deleteNotification,deleteGroup, deleteSearchedGroup
    }
}