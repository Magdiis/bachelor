import {ref} from "vue";
import {Group} from "@/model/group/Group";
import {User} from "@/model/group/User";
import {globalProfile} from "@/composables/store/profileStore";
import {convertCategory} from "@/composables/categoryConvertor";
import {OwnGroup} from "@/model/group/ownGroupsResponse";
import {OwnUser} from "@/model/group/ownUsersResponse";
import fetchingMatchingBackend from "@/composables/matchingBackendController/fetchingMatchingBackend";
import {useGroupStore} from "@/composables/store/useGroupStore";

export const globalOwnGroups = ref<Array<OwnGroup>>([])
export const globalOwnSearchedGroups = ref<Array<OwnUser>>([])

export const areOwnGroupsEmpty = ref(true)

export const useOwnGroupStore = () => {
    const matchingBackend = fetchingMatchingBackend()

    async function getGroupsFromBackend(){
        await fetchOwnUsers()
        await fetchOwnGroups()
        areOwnGroupsEmpty.value = globalOwnGroups.value.length < 1 && globalOwnSearchedGroups.value.length < 1;
    }

    async function fetchOwnGroups() {
        const groupsFromBackend = await matchingBackend.getOwnGroups(globalProfile.id)
        globalOwnGroups.value = []
        groupsFromBackend.forEach((g)=>{
            globalOwnGroups.value.push({
                color: g.color,
                currentMembers: g.currentMembers,
                description: g.description,
                id: g.id,
                maxMembers: g.maxMembers,
                membersIDs: g.membersIDs,
                name: g.name,
                useCase: g.useCase,
                userId: g.userId,
                category: g.category,
                compatibility: g.compatibility
            })
        })
    }

    async function fetchOwnUsers() {
        const usersFromBackend = await matchingBackend.getOwnUsers(globalProfile.id)
        globalOwnSearchedGroups.value = []
        usersFromBackend.forEach((u)=>{
            globalOwnSearchedGroups.value.push({
                color: u.color, groupId: u.groupId, groupName: u.groupName,
                id: u.id, category:u.category, userId: u.userId,
                compatibility: u.compatibility, useCase: u.useCase
            })
        })
    }

    function returnOwnGroup(groupId: string): OwnGroup| undefined {
        return globalOwnGroups.value.find((g)=>{
            return g.id === groupId
        })
    }

    function changeOwnGroupAfterEdit(groupId: string, group: Group){
        let findedGroup = globalOwnGroups.value.find((g)=>{
            return g.id === groupId
        })
        if(findedGroup){
            let index = globalOwnGroups.value.indexOf(findedGroup)
            if(index !== -1){
                const editedOwnGroup: OwnGroup = {
                    category: findedGroup.category,
                    color: group.color,
                    compatibility: findedGroup.compatibility,
                    currentMembers: findedGroup.currentMembers,
                    description: group.description,
                    id: findedGroup.id,
                    maxMembers: group.maxMembers,
                    membersIDs: findedGroup.membersIDs,
                    name: group.name,
                    useCase: findedGroup.useCase,
                    userId: findedGroup.userId
                }
                globalOwnGroups.value[index] = editedOwnGroup
            }
        }

    }

    return {
        changeOwnGroupAfterEdit,getGroupsFromBackend, returnOwnGroup
    }

}
