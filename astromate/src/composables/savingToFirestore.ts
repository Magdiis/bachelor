import type {User} from '@/model/User'
import {collection, getFirestore, getDocs, addDoc, setDoc, Timestamp, doc} from "firebase/firestore";
import {
    db,
    decision_collection,
    groups_collection,
    notification_collection,
    profiles_collection,
    users_collection
} from '@/firebase-service';
import {Group} from '@/model/Group';
import {Profile} from '@/model/Profile'
import {
    useCase, useCasesValues, workCases, workCasesValues, SportCases,
    sportCasesValues, colorsCases, colorsCasesValues
} from '@/model/createGroupEnums'
import {returnCategory} from '@/composables/categoryConvertor'
import {Decision} from "@/model/Decision";
import {NotificationMessage} from "@/model/NotificationMessage";


export default function savingToFirestore() {

    async function createProfile(profile: Profile):Promise<boolean> {
        try {
            await setDoc(doc(db,"profiles",profile.id),{
                name: profile.name,
                description: profile.description,
                date: profile.date,
                place: profile.place,
            })
            return true
        } catch (e) {
            console.error("Error adding document: ", e)
            throw new Error("Error with create profile")
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
                membersIDs: group.membersIDs,
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

    async function createNotification(notification: NotificationMessage){
        try {
            const docRef = await addDoc(notification_collection,{
                text:notification.text,
                read: notification.read,
                sentAt: notification.sentAt,
                receiver: notification.receiver,
                sender: notification.sender,
                senderName: notification.senderName,
                groupName: notification.groupName,
                groupDocumentID: notification.groupDocumentID,
                userDocumentID: notification.userDocumentID
            })
        } catch (e) {
            console.error("Error adding document: ", e)
        }
    }

    return {createProfile, createGroup, createUser, createDecision,createNotification}
}