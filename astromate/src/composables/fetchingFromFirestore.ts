import { Group } from '@/model/Group';
import type {User} from '@/model/User'
import { FirestoreDataConverter, getDocs,query, where } from "firebase/firestore";
import { groups_collection, profiles_collection, users_collection } from '@/firebase-service';
import {  toRefs } from 'vue';
import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
    sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'
import {convertCategory} from '@/composables/categoryConvertor'

export default function fetchingFirebase() {


    // CREATED CARDS FOR SEARCHING PEOPLE FOR GROUPS
    async function getOwnGroups(userID: string): Promise<Group[]> {
        const q = query(groups_collection, where("userId","==",userID))
        var groups: Group[] = []
        try {
            const groupsRef = await getDocs(q)
            if (groupsRef.empty){
                console.log("return empty list")
                return groups
            } else {
                groupsRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    groups.push({
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
                console.log("return empty list")
                return users
            } else {
        
                usersRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    users.push({
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



    // GETTING USERS FOR THE USE CASE (CATEGORY)
    async function getOthersUsers(userID: string, useCase: string, workCases:string, sportCases:string): Promise<User[]> {
        const q = query(users_collection, where("userId","!=",userID),where("userId","!=",userID),where("useCase","==",useCase), 
        where("workCases","==",workCases),where("sportCases","==",sportCases))
        var users: User[] = []
        try {
            const usersRef = await getDocs(q)
            if (usersRef.empty){
                console.log("return empty list")
                return users
            } else {
        
                usersRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    users.push({
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

    //GETTING GROUPS FOR THE USE CASE (CATEGORY)
    async function getOthersGroups(userID: string, useCase: string, workCases:string, sportCases:string): Promise<Group[]> {
        const q = query(groups_collection, where("userId","!=",userID),where("useCase","==",useCase), 
        where("workCases","==",workCases),where("sportCases","==",sportCases))
        var groups: Group[] = []
        try {
            const groupsRef = await getDocs(q)
            if (groupsRef.empty){
                console.log("return empty list")
                return groups
            } else {
                groupsRef.forEach((doc) => {
                    const {sportCaseThis, workCaseThis} = convertCategory(doc.data().useCase, doc.data().category)
                    groups.push({
                        userId: doc.data().userId,
                        name:doc.data().name,
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
        } catch (e){
            console.error("Error fetching groups: ", e)
            return groups
        }
    }

    return { getOwnGroups, getOwnUsers, getOthersUsers, getOthersGroups }
}


