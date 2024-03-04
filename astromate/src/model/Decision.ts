import { Timestamp } from "firebase/firestore";

export interface Decision {
    id: string,
    like: boolean,
    decidedAt: Timestamp,
    groupOrProfileID: string
}