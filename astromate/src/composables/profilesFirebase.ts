import type {User} from '@/model/User'
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";
import { groups_collection, profiles_collection, users_collection } from '@/firebase-service';
import { Group } from '@/model/Group';
import {Profile} from '@/model/Profile'


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
                workCases:group.workCases ,
                sportCases:group.sportCases ,
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
                workCases:user.workCases,
                sportCases:user.sportCases,
                color:user.color,
                groupId:user.groupId
            })
            
            console.log("saved");
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    return {createProfile, createGroup, createUser}
}