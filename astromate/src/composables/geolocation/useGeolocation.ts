import {ref} from "vue";
import { Geolocation } from '@capacitor/geolocation';
import {GeolocationWeb} from "@capacitor/geolocation/dist/esm/web";

export type Coordinates = {
    latitude: number,
    longitude: number
}

export const useGeolocation = () => {
    const location = ref<Coordinates>()
    const getCurrentPosition = async () => {
        try{
            const coordinates = await Geolocation.getCurrentPosition();
            location.value = {latitude: coordinates.coords.latitude,
                longitude: coordinates.coords.longitude}

            console.log('Current position:', coordinates.coords);
        } catch (error: any) {
            console.log("error: ", error)
            throw Error(error)
        }
    };

    const checkPermissions = async (): Promise<string> =>{
        try {
            const status = await Geolocation.checkPermissions()
            return status.location
        } catch (error: any) {
            throw Error(error)
        }
    }


    return {
        getCurrentPosition, checkPermissions, location
    };
};