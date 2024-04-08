import {doc, updateDoc, arrayUnion, increment, getDoc, query, collection, where, getDocs} from "firebase/firestore";
import {db} from "@/firebase-service";
import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
import {globalProfile} from "@/composables/store/profileStore";
import {GroupChat} from "@/model/chat/Chat";
import {Group} from "@/model/group/Group";
import {Profile} from "@/model/profile/Profile";



export default function updateInFirestore() {
    // MATCHING
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

    // MATCHED
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

    // REMOVE
    async function removeFromGroup(groupDocumentId: string, profileId: string){
        const groupRef = doc(db, "groups", groupDocumentId)
        const groupSnap = await getDoc(groupRef)
        if(groupSnap.exists()){
            try {
                await updateDoc(groupRef,{
                    currentMembers: increment(-1),
                    membersIDs: updateMembers(groupSnap.data().membersIDs, profileId)
                })
            } catch (e) {
                console.error("Error updating group document: ", e)
            }
        } else {
            console.log("No such group document with id: ", groupDocumentId);
        }
    }
    function updateMembers(membersIds: string[], profileId: string): string[]{
        return membersIds.filter((id) => {
            return id !== profileId
        })
    }
    async function setGroupIdEmpty(groupId: string){
        const q = query(collection(db, "users"),
            where("groupId", "==", groupId));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
                const searchedGroupId = querySnapshot.docs[0].id
                const searchedGroupRef = doc(db, "users", searchedGroupId)
                try {
                     await updateDoc(searchedGroupRef,{
                         groupId: ""
                     })
                } catch (e) {
                    console.error("Error updating searhed group document", e)
                }
            } else {
                console.error("wrong groupId, ", groupId)
            }
        } catch (e) {
            console.error("Error fetching searched group document: ", e)
        }
    }
    // GROUP CHAT
    async function addMemberToGroupChat(groupChatId: string,memberId: string, memberName: string){
        try {
            const groupChatDoc = doc(db, "groupChat", groupChatId)
            await updateDoc(groupChatDoc,{
                countMembers: increment(1),
                membersIDs: arrayUnion(memberId),
                membersNames: arrayUnion(memberName),
                membersNamesAndIDs:arrayUnion(memberName + ";"+memberId)
            })
        } catch (e) {
            console.error("Error updating group chat document: ", e)
        }
    }

    async function leaveGroupChat(updatedGroupChat: GroupChat){
        try {
            const groupChatDoc = doc(db,"groupChat", updatedGroupChat.id)

            await updateDoc(groupChatDoc,{
                countMembers: updatedGroupChat.countMembers,
                membersIDs: updatedGroupChat.membersIDs,
                membersNames: updatedGroupChat.membersNames,
                membersNamesAndIDs: updatedGroupChat.membersNamesAndIDs
            })
        }catch (e) {
            console.error("Error updating group chat document: ", e)
        }
    }

    async function removeUserFromGroup(updatedGroup: Group){
        try {
            const groupDoc = doc(db,"groups",updatedGroup.id)
            await updateDoc(groupDoc,{
                currentMembers: updatedGroup.currentMembers,
                membersIDs: updatedGroup.membersIDs
            })
        } catch (e) {
            console.error("Error updating group document: ", e)
        }
    }

    async function updateProfile(updatedProfile: Profile){
        try{
            const profileDoc = doc(db, "profiles", updatedProfile.id)
            await updateDoc(profileDoc, {
                date: updatedProfile.date,
                description: updatedProfile.description,
                name: updatedProfile.name,
                place: updatedProfile.place
            })
        } catch (e) {
            console.error("Error updating profile document: ", e)
        }
    }

    return {updateProfile,removeUserFromGroup,setGroupIdEmpty,removeFromGroup,addGroupsSeenBy,leaveGroupChat, addUsersSeenBy, addMemberToGroup, setGroupId, addMemberToGroupChat}
}