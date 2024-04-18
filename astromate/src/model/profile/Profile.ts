
import {Coordinates} from "@/composables/geolocation/useGeolocation";


export interface Profile {
    id:string,
    name: string,
    description: string,
    date: string,
    place: Coordinates,
}