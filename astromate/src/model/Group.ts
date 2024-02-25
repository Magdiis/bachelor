export interface Group {
    userId: string,
    name:string,
    maxMembers: number,
    currentMembers: number,
    description: string,
    useCase: string,
    workCase:string ,
    sportCase:string ,
    membersIDs: string[],
    color: string
}