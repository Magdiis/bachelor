import { doc, updateDoc, arrayUnion } from "firebase/firestore";
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

    return {addGroupsSeenBy, addUsersSeenBy}
}