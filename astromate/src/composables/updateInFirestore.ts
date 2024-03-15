import { doc, updateDoc, arrayUnion, increment  } from "firebase/firestore";
import {db} from "@/firebase-service";
import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";



export default function updateInFirestore() {
    async function addGroupsSeenBy(groupID: string, profileID: string){
        const groupRef = doc(db,"groups",groupID)
        await updateDoc(groupRef,{
            wasSeenBy: arrayUnion(profileID)
        })
    }

    async function addUsersSeenBy(userID:string, profileID:string){
        const userRef = doc(db, "users",userID)
        await updateDoc(userRef,{
            wasSeenBy: arrayUnion(profileID)
        })
    }

    async function addMemberToGroup(groupDocumentId: string, memberId: string){
        try {
            const groupRef = doc(db,"groups",groupDocumentId)
            await updateDoc(groupRef,{
                membersIDs: arrayUnion(memberId),
                currentMembers: increment(1)
            })
        } catch (e) {
            console.error("Error updating group document: ", e)
        }
    }

    async function setGroupId(usersDocumentId: string, groupId: string){
        try {
            const userRef = doc(db,"users",usersDocumentId)
            await updateDoc(userRef,{
                groupId: groupId
            })
        } catch (e) {
            console.error("Error updating user document: ", e)
        }

    }
    return {addGroupsSeenBy, addUsersSeenBy, addMemberToGroup, setGroupId}
}