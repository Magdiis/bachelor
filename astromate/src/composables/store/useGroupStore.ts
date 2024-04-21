import {reactive} from "vue";
import {Group} from "@/model/group/Group";
import {User} from "@/model/group/User";

// ALL
export const globalSearchedGroups = reactive<User[]>([])
export const globalGroups= reactive<Group[]>([])

// SELECTED
export const globalSelectedGroup = reactive<Group>({
    color: "", currentMembers: 0, description: "", id: "", maxMembers: 0, membersIDs: [], name: "", sportCase: "", useCase: "", userId: "", workCase: ""
})

export const globalSelectedSearchedGroup = reactive<User>({
    color: "", groupId: "", id: "", groupName: "", sportCase: "", useCase: "", userId: "", workCase: ""
})

// EDITED
export const globalSearchedGroupEditing = reactive<User>({
    color: "", groupId: "", id: "", groupName: "", sportCase: "", useCase: "", userId: "", workCase: ""
})
export const globalGroupEditing = reactive<Group>({
    color: "", currentMembers: 0, description: "", id: "", maxMembers: 0, membersIDs: [], name: "", sportCase: "", useCase: "", userId: "", workCase: ""
})

export const useGroupStore = () => {

    /****************** SET ******************/
    // all groups
    const setOwnGroups = (addedOwnGroups: Group[])=>{
        globalGroups.splice(0)
        globalGroups.push(...addedOwnGroups)
    }

    const setOwnSearchedGroups = (addedOwnSearchedGroups: User[]) => {
        globalSearchedGroups.splice(0)
        globalSearchedGroups.push(...addedOwnSearchedGroups)
    }

    const setSearchedGroups = (addedSearchedGroups: User[])=>{
        globalSearchedGroups.splice(0)
        globalSearchedGroups.push(...addedSearchedGroups)
    }

    // editing groups
    const setEditingGroup = (editingGroup: Group)=>{
        Object.assign(globalGroupEditing, editingGroup)
    }

    const setEditingSearchedGroup = (editingSearchedGroup: User) =>{
        Object.assign(globalSearchedGroupEditing, editingSearchedGroup)
    }

    /****************** GET ******************/
    // group by groupId
    const getSearchedGroupByGroupId = (groupId: string): User => {
        const result = globalSearchedGroups.find((ownGroup)=>{
            return ownGroup.groupId == groupId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong group id in getSearchedGroupByGroupId")
    }

    // group by id
    const getSearchedGroupById = (searchedGroupId: string): User => {

        const result = globalSearchedGroups.find((searchedGroup)=>{
            return searchedGroup.id == searchedGroupId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong group id in getSearchedGroupByGroupId")
    }

    const getGroup = (groupId: string):Group => {
        const result = globalGroups.find((searchedGroup)=>{
            return searchedGroup.id === groupId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong group id in getGroup")
    }


    /****************** CLEAR ******************/
    // groups
    const clear = () => {
        globalGroups.splice(0)
        globalSearchedGroups.splice(0)
    }

    // editing
    const clearEditing = () =>{
        const clearSearchedGroup: User = {color: "", groupId: "", id: "", groupName: "", sportCase: "", useCase: "", userId: "", workCase: ""}
        const clearGroup: Group = {color: "", currentMembers: 0, description: "", id: "", maxMembers: 0, membersIDs: [], name: "", sportCase: "", useCase: "", userId: "", workCase: ""}
        Object.assign(globalGroupEditing, clearGroup)
        Object.assign(globalSearchedGroupEditing, clearSearchedGroup)
    }


    return {setOwnSearchedGroups,clear,setOwnGroups, setSearchedGroups,getSearchedGroupByGroupId, getGroup,
        setEditingSearchedGroup, setEditingGroup, clearEditing, getSearchedGroupById}
}