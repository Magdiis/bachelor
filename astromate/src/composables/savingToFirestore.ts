import type {User} from '@/model/User'
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";
import { groups_collection, profiles_collection, users_collection } from '@/firebase-service';
import { Group } from '@/model/Group';
import {Profile} from '@/model/Profile'
import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
    sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'


export default function profilesFirebase(){

    async function createProfile(profile:Profile) {
        try {
            const docRef = await addDoc(profiles_collection, {
                name: profile.name,
                description: profile.description,
                date: profile.date,
                place: profile.place
            })
            localStorage.setItem("userID", docRef.id)
            console.log("saved");
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    async function createGroup(group: Group) {
        try {
            const docRef = await addDoc(groups_collection, {
                userId: group.userId,
                color: group.color,
                name:group.name,
                maxMembers: group.maxMembers,
                currentMembers: group.currentMembers,
                description: group.description,
                useCase: group.useCase,
                category: returnCategory(group.useCase, group.workCase, group.sportCase),
                membersIDs: []
            })
            console.log("saved");
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    async function createUser(user:User) {
        try {
            const docRef = await addDoc(users_collection, {
                userId: user.userId,
                name:user.name,
                useCase: user.useCase,
                category: returnCategory(user.useCase, user.workCase, user.sportCase),
                color:user.color,
                groupId:user.groupId
            })
            
            console.log("saved");
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }


    function returnCategory(useCaseParam:string, workCaseParam:string, sportCaseParam:string): string {
        if(useCaseParam == useCase.Work){
            return workCaseParam
        } if (useCaseParam == useCase.Sport) {
            return sportCaseParam
        } else {
            return ""
        }
    }

    return {createProfile, createGroup, createUser}
}