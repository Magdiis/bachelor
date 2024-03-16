import { Group } from '@/model/Group';
import type {User} from '@/model/User'
import {FirestoreDataConverter,orderBy,getDoc , Query, getDocs, query,onSnapshot , where, doc} from "firebase/firestore";
import {
    db,
    groups_collection,
    notification_collection,
    profiles_collection,
    users_collection
} from '@/firebase-service';
import {  toRefs } from 'vue';
import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
    sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'
import {convertCategory} from '@/composables/categoryConvertor'
import {returnCategory} from '@/composables/categoryConvertor'
import {Profile} from "@/model/Profile";
//import firebase from "firebase/compat";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { NotificationMessage} from "@/model/NotificationMessage";
import {useProfileStore} from "@/composables/store/profileStore";

export default function fetchingFirebase() {

    // CREATED CARDS FOR SEARCHING PEOPLE FOR GROUPS
    async function getOwnGroups(userID: string): Promise<Group[]> {
        const q = query(groups_collection, where("userId","==",userID))
        var groups: Group[] = []
        try {
            const groupsRef = await getDocs(q)
            if (groupsRef.empty){

                return groups
            } else {
                groupsRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    groups.push({
                        id: doc.id,
                        userId: doc.data().userId,
                        name:doc.data().name,
                        maxMembers: doc.data().maxMembers,
                        currentMembers: doc.data().currentMembers,
                        description: doc.data().description,
                        useCase: doc.data().useCase,
                        workCase: workCaseThis ,
                        sportCase: sportCaseThis ,
                        membersIDs: doc.data().membersIDs,
                        color: doc.data().color
                    })
                }) 
                
                return groups
            }
        } catch (e){
            console.error("Error fetching groups: ", e)
            return groups
        }
    }


    // CREATED CARDS FOR SEARCHING GROUPS TO CONNECT
    async function getOwnUsers(userID: string): Promise<User[]> {
        const q = query(users_collection, where("userId","==",userID))
        var users: User[] = []
        try {
            const usersRef = await getDocs(q)
            if (usersRef.empty){

                return users
            } else {
        
                usersRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    users.push({
                        wasSeenBy: doc.data().wasSeenBy,
                        id: doc.id,
                        userId:  doc.data().userId,
                        name:doc.data().name,
                        useCase: doc.data().useCase,
                        workCase: workCaseThis,
                        sportCase: sportCaseThis,
                        color:doc.data().color,
                        groupId:doc.data().groupId
                    })
                }) 
                
                return users
            }
        } catch (e){
            console.error("Error fetching groups: ", e)
            return users
        }

    }

    async function fetchMembersProfiles(membersIDs: string[]): Promise<Profile[]>{
        console.log("Fetching")
        var profiles: Profile[] = []

        const q: Query = query(profiles_collection, where('__name__', "in" ,membersIDs))
        try {
            const profilesRef = await getDocs(q)
            if (profilesRef.empty){
                console.log("empty")
                return profiles
            } else {
                profilesRef.forEach((doc)=>{
                    console.log(doc.data().name)
                    profiles.push({
                        date: doc.data().date,
                        description: doc.data().description,
                        id: doc.data().id,
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
            const docRef = doc(db,"profiles", profileID)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()){
                console.log("empty")
                return undefined
            } else {
                return {
                    date: docSnap.data().date,
                    description: docSnap.data().description,
                    id: docSnap.data().id,
                    name: docSnap.data().name,
                    place: docSnap.data().place
                }
            }

        }catch (e) {
            console.error("Error fetching groups: ", e)
            return undefined
        }
    }

    async function isProfileExist(profileID: string):Promise<boolean>{
        try {
            const docRef = doc(db,"profiles", profileID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                console.log("data", docSnap.data())
                const foundedProfile: Profile = {
                    date: docSnap.data().date, description: docSnap.data().description,
                    id: profileID, name: docSnap.data().name, place: docSnap.data().place
                }

                //TODO: condition if we want to save to profile store
                useProfileStore().setProfile(foundedProfile)
            }
            console.log("dokument exists() ",docSnap.exists())
            return docSnap.exists()
        }catch (e) {
            console.error("Error ", e)
            throw new Error("Error")
        }

    }

    async function getChats(){}


    return { getOwnGroups, getOwnUsers , fetchMembersProfiles, fetchProfile, isProfileExist }
}


