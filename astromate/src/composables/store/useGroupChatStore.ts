import {reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";
import {GroupChat} from "@/model/chat/Chat";


export const globalGroupChats = reactive<GroupChat[]>([])

export const currentGroupChat = ref<GroupChat|undefined>(undefined)
export const useGroupChatStore = () => {
    const setCurrentGroupChat = (groupChatId: string) => {
        currentGroupChat.value = getGroupChat(groupChatId)
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
        currentGroupChat.value = groupChat
    }


    return {setGroupChats,getGroupChat, clear, setCurrentGroupChat, updateCurrentGroupChat}
}