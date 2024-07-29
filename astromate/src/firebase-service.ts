import {initializeApp} from "firebase/app"
import "firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";
import {myConfig} from "@/config";
import {getAuth} from "firebase/auth";
import {getStorage, ref} from "firebase/storage";

export const firebaseApp = initializeApp(myConfig.firebase)
export const db = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp);


export const profiles_collection = collection(db, 'profiles')
export const groups_collection = collection(db, 'groups')
export const users_collection = collection(db, "users")
export const decision_collection = collection(db, "decision")

export const notification_collection = collection(db,"notifications")
export const groups_chat_collection = collection(db,"groupChat")

export const chats_collection = collection(db,"chat")


export const storage = getStorage(firebaseApp);
const storageRef = ref(storage);