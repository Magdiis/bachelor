import {initializeApp} from "firebase/app"
import "firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";
import {myConfig} from "@/config";

  export const firebaseApp = initializeApp(myConfig.firebase)
  export const db = getFirestore(firebaseApp)
  export const profiles_collection = collection(db, 'profiles')
  export const groups_collection = collection(db,'groups')
  export const users_collection = collection(db, "users")




