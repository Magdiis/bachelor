import {Timestamp} from "firebase/firestore";

export interface NotificationMessage{
    id: string,
    text:number,
    read: boolean,
    sentAt: Timestamp,
    receiver: string,
    sender: string,
    senderName: string,
    groupName: string,
    groupDocumentID: string,
    userDocumentID: string,
    toBeDeleted: boolean
}

export enum notificationNames {
    a = "",

}

export enum notificationText {
    UserWantsUserToHisGroup =1,  //"Uživatel vás chce přidat do skupiny",
    UserWantsToUsersGroup = 2, //"Uživatel se chce přidat do vaší skupiny",
    UserAddedUser = 3, // "Uživatel vás přidal do své skupiny",
    UserRemovedUser = 4 //"Uživatel vás odebral ze skupiny",
}