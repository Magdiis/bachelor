import {reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";


export const globalProfile = reactive<Profile>({
    handy: "", plan: "", temperament: "", thinking: "",
    place: {latitude:0, longitude:0},
    date: "", description: "", id: "", name: ""
})

export const globalProfilePhotoURl = ref("")
export const useProfileStore = () => {
    const setId = (authID: string) => {
        globalProfile.id = authID
    }
    const setProfile = (addedProfile: Profile) => {
        globalProfile.id = addedProfile.id
        globalProfile.name = addedProfile.name
        globalProfile.date = addedProfile.date
        globalProfile.place = addedProfile.place
        globalProfile.description = addedProfile.description
        globalProfile.handy = addedProfile.handy
        globalProfile.plan = addedProfile.plan
        globalProfile.temperament = addedProfile.temperament
        globalProfile.thinking = addedProfile.thinking
    }

    const clearProfile = () => {
        globalProfile.id = ""
        globalProfile.name = ""
        globalProfile.place = {latitude:0, longitude:0}
        globalProfile.date = ""
        globalProfile.description = ""
        globalProfile.handy = ""
        globalProfile.plan = ""
        globalProfile.temperament = ""
        globalProfile.thinking = ""
    }

    const setURL = (URL: string)=>{
        globalProfilePhotoURl.value = URL
    }

    const clearURL = ()=>{}
    globalProfilePhotoURl.value = ""

    return {clearURL,setProfile, setId, clearProfile, setURL}
}