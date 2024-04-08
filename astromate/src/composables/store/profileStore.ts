import {reactive, ref} from "vue";
import {Profile} from "@/model/profile/Profile";


export const globalProfile = reactive<Profile>({
    date: "", description: "", id: "", name: "", place: ""
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
    }

    const clearProfile = () => {
        globalProfile.id = ""
        globalProfile.name = ""
        globalProfile.place = ""
        globalProfile.date = ""
        globalProfile.description = ""
    }

    const setURL = (URL: string)=>{
        globalProfilePhotoURl.value = URL
    }

    return {setProfile, setId, clearProfile, setURL}
}