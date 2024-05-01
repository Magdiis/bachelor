import axios from "axios";
import {GroupsFilter} from "@/model/group/GroupsFilter";
import {Group} from "@/model/group/Group";
import {GroupsResponse} from "@/model/group/GroupsResponse";
import {convertCategory} from "@/composables/categoryConvertor";
import {User} from "@/model/group/User";
import {UsersResponse} from "@/model/group/UsersResponse";
import {OwnUser, OwnUsersResponse} from "@/model/group/ownUsersResponse";
import {OwnGroup, OwnGroupsResponse} from "@/model/group/ownGroupsResponse";
export default function fetchingMatchingBackend(){
    const URI = "http://localhost:3000/"
    //const URI = "https://9623-83-240-62-210.ngrok-free.app/"

    async function getOtherGroups(groupsFilter:GroupsFilter): Promise<Group[]>{
        var groups: Group[] = []
        try {
            const response = await axios.get<GroupsResponse>(URI + "getOtherGroups/" +
                groupsFilter.userId + "/" +
                groupsFilter.useCase + "/" +
                groupsFilter.category /*,{headers:{"ngrok-skip-browser-warning":"1"}}*/);

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
        } catch (error: any) {
            console.log("error:", error.message, JSON.stringify(error))
            return groups
        }
    }

    async function getOtherUsers(groupsFilter:GroupsFilter):Promise<User[]>{
        var users: User[] = []
        try {
            const response = await axios.get<UsersResponse>(URI + "getOtherUsers/" +
                groupsFilter.userId + "/" +
                groupsFilter.useCase + "/" +
                groupsFilter.category /*,{headers:{"ngrok-skip-browser-warning":"1"}}*/);
            if(response.data.users.length > 0){
                response.data.users.forEach((user)=>{
                    const {sportCaseThis, workCaseThis} = convertCategory(user.useCase,user.category)
                    users.push({
                        color: user.color,
                        id: user.id,
                        groupId: user.groupId,
                        groupName: user.groupName,
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

        } catch (error: any) {
            console.log("error:", error.message, JSON.stringify(error))
            return users
        }
    }

    async function getOwnUsers(userId: string):Promise<OwnUser[]>{
        var ownUsers: OwnUser[] = []
        try {
            const response = await axios.get<OwnUsersResponse>(URI + "getOwnUsers/" +
                userId
                /*,{headers:{"ngrok-skip-browser-warning":"1"}}*/);
            if(response.data.ownUsers.length < 1){
                return ownUsers
            } else {
                response.data.ownUsers.forEach((ownUser)=>{

                    ownUsers.push({
                        category: ownUser.category,
                        color: ownUser.color,
                        compatibility: ownUser.compatibility,
                        groupId: ownUser.groupId,
                        groupName: ownUser.groupName,
                        id: ownUser.id,
                        useCase: ownUser.useCase,
                        userId: ownUser.userId
                    })
                })
                return ownUsers
            }
        } catch (error:any) {
            console.log("error:", error.message, JSON.stringify(error))
            return ownUsers
        }
    }

    async function getOwnGroups(userId: string): Promise<OwnGroup[]>{
        var ownGroups: OwnGroup[] = []
        try {
            const response = await axios.get<OwnGroupsResponse>(URI + "getOwnGroups/" +
                userId
                /*,{headers:{"ngrok-skip-browser-warning":"1"}}*/);
            if(response.data.ownGroups.length < 1){
                return ownGroups
            } else {
                response.data.ownGroups.forEach((ownGroup)=>{
                    ownGroups.push({
                        category: ownGroup.category,
                        color: ownGroup.color,
                        compatibility: ownGroup.compatibility,
                        currentMembers: ownGroup.currentMembers,
                        description: ownGroup.description,
                        id: ownGroup.id,
                        maxMembers: ownGroup.maxMembers,
                        membersIDs: ownGroup.membersIDs,
                        name: ownGroup.name,
                        useCase: ownGroup.useCase,
                        userId: ownGroup.userId
                    })
                })
                return ownGroups
            }
        } catch (error:any) {
            console.log("error:", error.message, JSON.stringify(error))
            return ownGroups
        }
    }

    return {getOwnGroups,getOwnUsers,getOtherGroups, getOtherUsers}
}

