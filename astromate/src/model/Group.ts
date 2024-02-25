export interface Group {
    userId: string,
    name:string,
    maxMembers: number,
    currentMembers: number,
    description: string,
    useCase: string,
    workCases:string ,
    sportCases:string ,
    membersIDs: string[],
    color: string
}