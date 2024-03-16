import {reactive} from "vue";
import {Profile} from "@/model/Profile";


export const globalProfile = reactive<Profile>({
    date: "", description: "", id: "", name: "", place: ""
})
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

    return {setProfile, setId}
}