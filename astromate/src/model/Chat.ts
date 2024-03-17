import {Timestamp} from "firebase/firestore";



// Group chat will be in GroupChatsPage.vue
export interface GroupChat {  //collection
    id: string,            // same like Group
    ownerID: string,
    countMembers: number,
    membersIDs: [string],
    membersNames: [string],
    color: string,
    isPairs: boolean,
    name: string
}

// This will be in ChatDetailPage.vue
export interface Chat {  //collection
    id: string,  // same like GroupChat
    messages: [TextMessage],

}

export interface TextMessage {
    id: string,
    sentAt: Timestamp,
    sentById: string,
    sentByName: string,
    messageText: string
}

export interface ChatParams {
    id: string,
    name: string
}