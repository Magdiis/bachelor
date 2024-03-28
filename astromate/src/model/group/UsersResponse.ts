
export interface UsersResponse {
    users: UserResponse[]
}

interface UserResponse{
    id:string,
    userId: string,
    name:string,
    useCase: string,
    category:string,
    color:string,
    groupId:string,
    wasSeenBy: string[]
}