import ephemeris from "ephemeris";
import {Timestamp} from "firebase/firestore";
import {getDegree} from "@/composables/empheremis/degreeConvertor";
import {userPlanets} from "@/composables/empheremis/useCompatibility";

export function usePlanetEphemeris(){
    const getPlanetsEphemeris = ((date: string, latitude: number, longitude: number): userPlanets =>{
        const fromStringDate = new Date(date)

        return {
            jupiter: getDegree(ephemeris.getPlanet('jupiter',fromStringDate,latitude, longitude, 0).observed.jupiter.apparentLongitudeDms360),
            mars: getDegree(ephemeris.getPlanet('mars',fromStringDate,latitude, longitude, 0).observed.mars.apparentLongitudeDms360),
            sun: getDegree(ephemeris.getPlanet('sun',fromStringDate,latitude, longitude, 0).observed.sun.apparentLongitudeDms360)
        }
    })
    return {
        getPlanetsEphemeris
    }
}

