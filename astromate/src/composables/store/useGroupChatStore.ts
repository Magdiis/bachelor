import {reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";
import {GroupChat} from "@/model/chat/Chat";


export const globalGroupChats = reactive<GroupChat[]>([])

export const currentGroupChat = reactive<GroupChat>({
    color: "",
    countMembers: 0,
    id: "",
    isPairs: false,
    membersIDs: [""],
    membersNames: [""],
    membersNamesAndIDs: [""],
    name: "",
    ownerID: ""
})
export const useGroupChatStore = () => {
    const setCurrentGroupChat = (groupChat: GroupChat) => {
        Object.assign(currentGroupChat,groupChat)
    }


    const setGroupChats = (addedGroupChats: GroupChat[]) => {
        globalGroupChats.splice(0)
        globalGroupChats.push(...addedGroupChats)
    }

    const getGroupChat = (groupChatId: string): GroupChat => {
        const result =  globalGroupChats.find((groupChat) => {
            return groupChat.id === groupChatId
        })
        if (result != undefined){
            return result
        }
        throw Error("wrong chat group id")
    }

    const clear = () => {
        globalGroupChats.splice(0)
    }

    const updateCurrentGroupChat = (groupChat: GroupChat) =>{
        Object.assign(currentGroupChat,groupChat)
    }


    return {setGroupChats,getGroupChat, clear, setCurrentGroupChat, updateCurrentGroupChat}
}