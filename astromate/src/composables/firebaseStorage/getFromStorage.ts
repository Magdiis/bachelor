import {ref} from "vue";
import {UserPhoto} from "@/model/profile/UserPhoto";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {globalProfile} from "@/composables/store/profileStore";
import {getDownloadURL, ref as storageRef} from "firebase/storage";
import {storage} from "@/firebase-service";

export interface responseStorage {
    URL: string | undefined,
    error: string | undefined
}

export default function getFromStorage() {

    async function getPhoto(profileId: string): Promise<responseStorage>{
        const pathReference = storageRef(storage, profileId+'.png')
        try {
            const URL = await getDownloadURL(pathReference)
            return {
                URL: URL, error: undefined
            }
        } catch (e: any) {
            // switch (e.code) {
            //     case 'storage/object-not-found':
            //         // File doesn't exist
            //         break;
            //     case 'storage/unauthorized':
            //         // User doesn't have permission to access the object
            //         break;
            //     case 'storage/canceled':
            //         // User canceled the upload
            //         break;
            //     case 'storage/unknown':
            //         // Unknown error occurred, inspect the server response
            //         break;
            // }
            return {
                URL: undefined, error: "error"
            }
        }
    }

    return {
        getPhoto
    };
};

