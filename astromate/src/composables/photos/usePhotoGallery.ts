import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {ref} from "vue";
import {UserPhoto} from "@/model/profile/UserPhoto";
import {ref as storageRef, uploadBytes} from "firebase/storage";
import {globalProfile} from "@/composables/store/profileStore";
import {storage} from "@/firebase-service";

export const usePhotoGallery = () => {
    const photo = ref<UserPhoto>()
    const takePhoto = async () => {
        const result = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = globalProfile.id + '.png';
        photo.value = {
            filepath: fileName,
            webviewPath: result.webPath,
        }
    };

    return {
        takePhoto, photo
    };
};

const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });


export const savePicture = async (photo: UserPhoto) => {
    // Fetch the photo, read as a blob, then save to Firebase storage
    const response = await fetch(photo.webviewPath!);
    const blob = await response.blob();
    //const base64Data = (await convertBlobToBase64(blob)) as string;
    //const imagesRef = ref(storage,'')
    const imagesRef = storageRef(storage,photo.filepath)
    await uploadBytes(imagesRef,blob).then((snapshot)=>{
        console.log('Uploaded a blob!');
    })
}