import {Group} from "@/model/group/Group";


export interface GroupsResponse {
    groups: GroupResponse[]
}

interface GroupResponse {
    id:string,
    userId: string,
    name:string,
    maxMembers: number,
    currentMembers: number,
    description: string,
    useCase: string,
    category:string ,
    membersIDs: string[],
    color: string
}