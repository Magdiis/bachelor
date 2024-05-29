import {doc, updateDoc, arrayUnion, increment, getDoc, query, collection, where, getDocs} from "firebase/firestore";
import {db} from "@/firebase-service";
import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
import {globalProfile} from "@/composables/store/profileStore";
import {GroupChat} from "@/model/chat/Chat";
import {Group} from "@/model/group/Group";
import {Profile} from "@/model/profile/Profile";
import {returnCategory} from "@/composables/categoryConvertor";
import {User} from "@/model/group/User";
import {NotificationMessage} from "@/model/notification/NotificationMessage";
import {colorsCases} from "@/model/group/createGroupEnums";



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


    async function setGroupId(usersDocumentId: string, groupId: string, groupName: string){
        try {
            const userRef = doc(db,"users",usersDocumentId)
            await updateDoc(userRef,{
                groupId: groupId,
                groupName: groupName
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

    // WHEN ADMIN REMOVE USER FROM GROUP CHAT
    async function removeGroupFromSearchedGroup(groupId: string, userId: string){
        const q = query(collection(db, "users"),
            where("groupId", "==", groupId),where("userId","==",userId));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
                const  searchedGroupId = querySnapshot.docs[0].id;
                const searchedGroupRef = doc(db, "users", searchedGroupId)
                await updateDoc(searchedGroupRef,{
                    groupId: "",
                    groupName: ""
                })
            } else {
                console.error("wrong group id ", groupId, " or user id", userId)
            }
        } catch (e) {
            console.error("Error fetching searched group document: ", e)
        }
    }

    // WHEN ADMIN DELETE GROUP
    async function setGroupIdEmptyInGroups(groupId: string){
        const q = query(collection(db, "users"),
            where("groupId", "==", groupId));
        try {
            const querySnapshot = await getDocs(q);
                for (const group of querySnapshot.docs) {
                        const searchedGroupRef = doc(db, "users", group.id)
                        await updateDoc(searchedGroupRef,{
                            groupId: "",
                            groupName: ""
                        })
                        console.log("seting group id = '' with id ", group.id)
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
                place: updatedProfile.place,
                temperament: updatedProfile.temperament,
                thinking: updatedProfile.thinking,
                plan: updatedProfile.plan,
                handy: updatedProfile.handy
            })
        } catch (e) {
            console.error("Error updating profile document: ", e)
        }
    }

    async function updateGroup(updatedGroup: Group){
        try{
            const groupDoc = doc(db,"groups", updatedGroup.id)
            await updateDoc(groupDoc,{
                color: updatedGroup.color,
                description: updatedGroup.description,
                maxMembers: updatedGroup.maxMembers,
                name: updatedGroup.name
            })
        } catch (e) {
            console.error("Error updating group document: ", e)
        }
    }

    async function updateColorAndNameInGroupChat(color: string, name: string, groupChatId: string){
        try {
            const groupChatDoc = doc(db, "groupChat",groupChatId )
            await updateDoc(groupChatDoc,{
                color: color,
                name: name
            })
        } catch (e) {
            console.error("Error updating group chat document: ", e)
        }
    }

    async function updateSearchedGroup(updatedSearchedGroup: User){
        try {
            const searchedGroupDoc = doc(db,"users", updatedSearchedGroup.id)
            await updateDoc(searchedGroupDoc,{
                color: updatedSearchedGroup.color
            })
        } catch (e) {
            console.error("Error updating searched group document: ", e)
        }
    }

    async function updateNameInGroupChats(groupChats: GroupChat[]){
        for (const g of groupChats) {
            try {
                const groupChatDoc = doc(db, "groupChat", g.id)
                await updateDoc(groupChatDoc,{
                    membersNames: g.membersNames,
                    membersNamesAndIDs: g.membersNamesAndIDs
                })
            } catch (e) {
                console.error("Error updating group chat document: ", e , "with id: ", g.id)
            }
        }
    }



    return {updateNameInGroupChats, updateColorAndNameInGroupChat,updateSearchedGroup,updateGroup,removeGroupFromSearchedGroup,updateProfile,removeUserFromGroup,setGroupIdEmptyInGroups,removeFromGroup,addGroupsSeenBy,leaveGroupChat, addUsersSeenBy, addMemberToGroup, setGroupId, addMemberToGroupChat}
}