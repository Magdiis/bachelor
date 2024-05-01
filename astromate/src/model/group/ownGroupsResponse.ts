export interface OwnGroupsResponse {
    ownGroups: OwnGroup[]
}

export interface OwnGroup {
    id:string,
    userId: string,
    name:string,
    maxMembers: number,
    currentMembers: number,
    description: string,
    useCase: string,
    category:string ,
    membersIDs: string[],
    color: string,
    compatibility: number
}