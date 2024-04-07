import {reactive} from "vue";
import {Group} from "@/model/group/Group";
import {User} from "@/model/group/User";

export const globalSearchedGroups = reactive<User[]>([])
export const globalGroups= reactive<Group[]>([])

export const useGroupStore = () => {
    const setOwnGroups = (addedOwnGroups: Group[])=>{
        globalGroups.splice(0)
        globalGroups.push(...addedOwnGroups)
    }

    const setSearchedGroups = (addedSearchedGroups: User[])=>{
        globalSearchedGroups.splice(0)
        globalSearchedGroups.push(...addedSearchedGroups)
    }

    const getSearchedGroupByGroupId = (groupId: string): User => {

        const result = globalSearchedGroups.find((ownGroup)=>{
            return ownGroup.groupId == groupId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong group id in getSearchedGroupByGroupId")
    }

    const getGroup = (ownGroupId: string):Group => {
        const result = globalGroups.find((searchedGroup)=>{
            return searchedGroup.id === ownGroupId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong group id in getGroup")
    }

    const clear = () => {
        globalGroups.splice(0)
        globalSearchedGroups.splice(0)
    }

    return {clear,setOwnGroups, setSearchedGroups,getSearchedGroupByGroupId, getGroup}
}