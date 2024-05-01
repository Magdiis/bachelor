export interface OwnUsersResponse {
    ownUsers: OwnUser[]
}

export interface OwnUser{
    id:string,
    userId: string,
    groupName:string,
    useCase: string,
    category:string,
    color:string,
    groupId:string,
    compatibility: number
}