import axios from "axios";
import {GroupsFilter} from "@/model/group/GroupsFilter";
import {Group} from "@/model/group/Group";
import {GroupsResponse} from "@/model/group/GroupsResponse";
import {convertCategory} from "@/composables/categoryConvertor";
import {User} from "@/model/group/User";
import {UsersResponse} from "@/model/group/UsersResponse";
export default function fetchingMatchingBackend(){
    const URI = "http://localhost:3000/"
    //const URI = "https://9623-83-240-62-210.ngrok-free.app/"
    async function getOtherGroups(groupsFilter:GroupsFilter): Promise<Group[]>{
        var groups: Group[] = []
        console.log("Before axios")
        await axios
            .get<GroupsResponse>(URI+"getOtherGroups/"
                +groupsFilter.userId+"/"
                +groupsFilter.useCase+"/"
                +groupsFilter.category /*,{headers:{"ngrok-skip-browser-warning":"1"}}*/)
            .then(response => {
                console.log("I am in getOtherGroups then")
                console.log("response data: ", JSON.stringify(response.data))
                if(response.data.groups.length > 0){
                         console.log("data:",response.data)
                        response.data.groups.forEach((group)=>{
                            const {sportCaseThis, workCaseThis} = convertCategory(group.useCase,group.category)
                            groups.push({
                                color: group.color,
                                currentMembers: group.currentMembers,
                                description: group.description,
                                id: group.id,
                                maxMembers: group.maxMembers,
                                membersIDs: group.membersIDs,
                                name: group.name,
                                sportCase: sportCaseThis,
                                useCase: group.useCase,
                                userId: group.userId,
                                workCase: workCaseThis
                            })
                        })
                    return groups
                } else {
                    return groups
                }
            })
            .catch(error => {
                console.log("error:", error.message, JSON.stringify(error))
            })
        return groups
    }

    async function getOtherUsers(groupsFilter:GroupsFilter):Promise<User[]>{
        var users: User[] = []
        await axios
            .get<UsersResponse>(URI+"getOtherUsers/"
                +groupsFilter.userId+"/"
                +groupsFilter.useCase+"/"
                +groupsFilter.category)
            .then(response => {
                if(response.data.users.length > 0){
                    console.log(response.data)
                    response.data.users.forEach((user)=>{
                        const {sportCaseThis, workCaseThis} = convertCategory(user.useCase,user.category)
                        users.push({
                            color: user.color,
                            id: user.id,
                            groupId: user.groupId,
                            name: user.name,
                            sportCase: sportCaseThis,
                            useCase: user.useCase,
                            userId: user.userId,
                            workCase: workCaseThis
                        })
                    })
                    return users
                } else {
                    return users
                }

            })
            .catch(error => {
                console.log(error)
            })
        return users
    }

    return {getOtherGroups, getOtherUsers}
}

