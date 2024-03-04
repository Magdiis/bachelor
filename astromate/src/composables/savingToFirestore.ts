import type {User} from '@/model/User'
import {collection, getFirestore, getDocs, addDoc, Timestamp} from "firebase/firestore";
import {decision_collection, groups_collection, profiles_collection, users_collection} from '@/firebase-service';
import {Group} from '@/model/Group';
import {Profile} from '@/model/Profile'
import {
    useCase, useCasesValues, workCases, workCasesValues, SportCases,
    sportCasesValues, colorsCases, colorsCasesValues
} from '@/model/createGroupEnums'
import {returnCategory} from '@/composables/categoryConvertor'
import {Decision} from "@/model/Decision";


export default function savingToFirestore() {

    async function createProfile(profile: Profile) {

        try {
            const docRef = await addDoc(profiles_collection, {
                name: profile.name,
                description: profile.description,
                date: profile.date,
                place: profile.place,
            })

            localStorage.setItem("userID", docRef.id)

        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    async function createGroup(group: Group) {
        try {
            const docRef = await addDoc(groups_collection, {
                userId: group.userId,
                color: group.color,
                name: group.name,
                maxMembers: group.maxMembers,
                currentMembers: group.currentMembers,
                description: group.description,
                useCase: group.useCase,
                category: returnCategory(group.useCase, group.workCase, group.sportCase),
                membersIDs: [],
                wasSeenBy: [group.userId]
            })
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    async function createUser(user: User) {

        try {
            const docRef = await addDoc(users_collection, {
                userId: user.userId,
                name: user.name,
                useCase: user.useCase,
                category: returnCategory(user.useCase, user.workCase, user.sportCase),
                color: user.color,
                groupId: user.groupId,
                wasSeenBy: [user.userId]
            })

        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    async function createDecision(decision: Decision){
        try {
            const docRef = await addDoc(decision_collection,{
                like: decision.like,
                decidedAt: decision.decidedAt,
                groupOrProfileID: decision.groupOrProfileID
            })
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    return {createProfile, createGroup, createUser, createDecision}
}