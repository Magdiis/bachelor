import {Group} from '@/model/group/Group';
import type {User} from '@/model/group/User'
import {arrayUnion, doc, getDoc, getDocs, increment, query, Query, updateDoc, where} from "firebase/firestore";
import {db, groups_chat_collection, groups_collection, profiles_collection, users_collection} from '@/firebase-service';
import {convertCategory} from '@/composables/categoryConvertor'
import {Profile} from "@/model/profile/Profile";
//import firebase from "firebase/compat";
import 'firebase/firestore';
import {useProfileStore} from "@/composables/store/profileStore";
import {GroupChat} from "@/model/chat/Chat";

export default function fetchingFirebase() {

    // CREATED CARDS FOR SEARCHING PEOPLE FOR GROUPS
    async function getOwnGroups(userID: string): Promise<Group[]> {
        const q = query(groups_collection, where("userId", "==", userID))
        var groups: Group[] = []
        try {
            const groupsRef = await getDocs(q)
            if (groupsRef.empty) {

                return groups
            } else {
                groupsRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    groups.push({
                        id: doc.id,
                        userId: doc.data().userId,
                        name: doc.data().name,
                        maxMembers: doc.data().maxMembers,
                        currentMembers: doc.data().currentMembers,
                        description: doc.data().description,
                        useCase: doc.data().useCase,
                        workCase: workCaseThis,
                        sportCase: sportCaseThis,
                        membersIDs: doc.data().membersIDs,
                        color: doc.data().color
                    })
                })

                return groups
            }
        } catch (e) {
            console.error("Error fetching groups: ", e)
            return groups
        }
    }


    // CREATED CARDS FOR SEARCHING GROUPS TO CONNECT
    async function getOwnUsers(userID: string): Promise<User[]> {
        const q = query(users_collection, where("userId", "==", userID))
        var users: User[] = []
        try {
            const usersRef = await getDocs(q)
            if (usersRef.empty) {

                return users
            } else {

                usersRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    users.push({
                        id: doc.id,
                        userId: doc.data().userId,
                        groupName: doc.data().groupName,
                        useCase: doc.data().useCase,
                        workCase: workCaseThis,
                        sportCase: sportCaseThis,
                        color: doc.data().color,
                        groupId: doc.data().groupId
                    })
                })

                return users
            }
        } catch (e) {
            console.error("Error fetching groups: ", e)
            return users
        }

    }

    async function fetchMembersProfiles(membersIDs: string[]): Promise<Profile[]> {
        var profiles: Profile[] = []

        const q: Query = query(profiles_collection, where('__name__', "in", membersIDs))
        try {
            const profilesRef = await getDocs(q)
            if (profilesRef.empty) {
                return profiles
            } else {
                profilesRef.forEach((doc) => {
                    console.log(doc.data().name)
                    profiles.push({
                        handy: doc.data().handy,
                        plan: doc.data().plan,
                        temperament: doc.data().temperament,
                        thinking: doc.data().thinking,
                        date: doc.data().date,
                        description: doc.data().description,
                        id: doc.id,
                        name: doc.data().name,
                        place: doc.data().place

                    })
                })
                return profiles
            }

        } catch (e) {
            console.error("Error fetching groups: ", e)
            return profiles
        }
    }

    async function fetchProfile(profileID: string): Promise<Profile | undefined> {
        try {
            const docRef = doc(db, "profiles", profileID)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                return undefined
            } else {
                return {
                    handy: docSnap.data().handy,
                    plan: docSnap.data().plan,
                    temperament: docSnap.data().temperament,
                    thinking: docSnap.data().thinking,
                    date: docSnap.data().date,
                    description: docSnap.data().description,
                    id: docSnap.id,
                    name: docSnap.data().name,
                    place: docSnap.data().place
                }
            }

        } catch (e) {
            console.error("Error fetching groups: ", e)
            return undefined
        }
    }

    async function isProfileExist(profileID: string): Promise<boolean> {
        try {
            const docRef = doc(db, "profiles", profileID)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {

                const foundedProfile: Profile = {
                    handy: docSnap.data().handy, plan: docSnap.data().plan,
                    temperament: docSnap.data().temperament, thinking: docSnap.data().thinking,
                    date: docSnap.data().date, description: docSnap.data().description,
                    id: profileID, name: docSnap.data().name, place: docSnap.data().place
                }

                //TODO: condition if we want to save to profile store
                useProfileStore().setProfile(foundedProfile)
            }
            return docSnap.exists()
        } catch (e) {
            console.error("Error ", e)
            throw new Error("Error")
        }

    }

    async function isUsernameExist(username: string): Promise<boolean> {
        try {
            const q: Query = query(profiles_collection, where('name','==',username))
            const docSnap = await getDocs(q)

            return !docSnap.empty
        } catch (e) {
            console.error("Error ", e)
            throw new Error("Error")
        }

    }



    async function getGroupChat(groupChatId: string): Promise<GroupChat>{
        try {
            const docRef = doc(db, "groupChat", groupChatId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                return {
                    color: docSnap.data().color,
                    countMembers: docSnap.data().countMembers,
                    id: docSnap.id,
                    isPairs: docSnap.data().isPairs,
                    membersIDs: docSnap.data().membersIDs,
                    membersNames: docSnap.data().membersNames,
                    membersNamesAndIDs: docSnap.data().membersNamesAndIDs,
                    name:docSnap.data().name,
                    ownerID: docSnap.data().ownerID
                }
            } else {
                throw new Error("group chat does not exist")
            }

        } catch (e) {
            console.error("error fetching messages ", e)
            throw new Error("")
        }
    }


    async function getSearchedGroupByGroupId(groupId: string, ownerId: string): Promise<User>{
        try {
            const q: Query = query(users_collection, where('groupId','==',groupId), where('userId','==',ownerId))
            const docSnap = await getDocs(q)
            if(docSnap.empty){
                console.error("error fetching searchedGroup, bad groupId or ownerId")
                throw new Error("")
            } else {
                const {sportCaseThis,workCaseThis} = convertCategory(docSnap.docs[0].data().useCase,docSnap.docs[0].data().category)
                return {
                    id: docSnap.docs[0].id,
                    userId: docSnap.docs[0].data().userId,
                    groupName: docSnap.docs[0].data().groupName,
                    useCase: docSnap.docs[0].data().useCase,
                    workCase: workCaseThis,
                    sportCase: sportCaseThis,
                    color: docSnap.docs[0].data().color,
                    groupId: docSnap.docs[0].data().groupId
                }
            }

        } catch (e) {
            console.error("error fetching searchedGroup, bad groupId", e)
            throw new Error("")
        }
    }

    async function getGroupById(groupId: string):Promise<Group>{
        try {
            const docRef = doc(db, "groups", groupId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                const {sportCaseThis,workCaseThis} = convertCategory(docSnap.data().useCase,docSnap.data().category)
                return {
                    id:docSnap.id,
                    userId: docSnap.data().userId,
                    name:docSnap.data().name,
                    maxMembers: docSnap.data().maxMembers,
                    currentMembers: docSnap.data().currentMembers,
                    description: docSnap.data().description,
                    useCase: docSnap.data().useCase,
                    workCase:workCaseThis,
                    sportCase:sportCaseThis ,
                    membersIDs: docSnap.data().membersIDs,
                    color: docSnap.data().color
                }
            } else {
                throw new Error("error fetching group, bad groupId")
            }
        }catch (e) {
            console.error("error fetching group, bad groupId", e)
            throw new Error("")
        }
    }

    async function checkIfGroupIsUnfilled(groupDocumentId: string): Promise<boolean>{
        try {
            const groupRef = doc(db,"groups",groupDocumentId)
            const docSnap = await getDoc(groupRef)
            if(docSnap.exists()){
                return docSnap.data().currentMembers < docSnap.data().maxMembers
            } else {
                return false
            }

        } catch (e) {
            console.error("Error get group document: ", e)
            throw new Error("")
        }
    }

    async function getGroupChatByMemberName(name: string): Promise<GroupChat[]>{
        try {
            const q: Query = query(groups_chat_collection, where('membersNames','array-contains',name))
            const docSnap = await getDocs(q)
            if(docSnap.empty){
                return []
            } else {
                let groupChats: GroupChat[] = []
                docSnap.forEach((doc)=>{
                    groupChats.push({
                        color: "",
                        countMembers: 0,
                        id: doc.id,
                        isPairs: false,
                        membersIDs: [""],
                        membersNames: doc.data().membersNames,
                        membersNamesAndIDs: doc.data().membersNamesAndIDs,
                        name: "",
                        ownerID: ""
                    })
                })
                return groupChats
            }

        } catch (e) {
            console.error("error fetching group chat, bad name", e)
            throw new Error("")
        }
    }


    return {checkIfGroupIsUnfilled, getGroupChatByMemberName, getGroupById,getSearchedGroupByGroupId, getGroupChat,isUsernameExist, getOwnGroups, getOwnUsers, fetchMembersProfiles, fetchProfile, isProfileExist}
}


