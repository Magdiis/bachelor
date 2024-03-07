import axios from "axios";
import {GroupsFilter} from "@/model/GroupsFilter";
import {Group} from "@/model/Group";
import {GroupsResponse} from "@/model/GroupsResponse";
import {convertCategory} from "@/composables/categoryConvertor";
import {User} from "@/model/User";
import {UsersResponse} from "@/model/UsersResponse";
export default function fetchingMatchingBackend(){
    const URI = "http://localhost:3000/"
    async function getOtherGroups(groupsFilter:GroupsFilter): Promise<Group[]>{
        var groups: Group[] = []
        await axios
            .get<GroupsResponse>(URI+"getOtherGroups/"
                +groupsFilter.userId+"/"
                +groupsFilter.useCase+"/"
                +groupsFilter.category)
            .then(response => {
                if(response.data.groups.length > 0){
                        console.log(response.data)
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
                console.log(error)
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
                            wasSeenBy: user.wasSeenBy,
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

