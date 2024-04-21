import ephemeris from "ephemeris";
import {Timestamp} from "firebase/firestore";
import {getDegree} from "@/composables/empheremis/degreeConvertor";

const dateObj = new Date('2015-08-10T17:09:01.000+08:00');

// parameters: ephemeris.getAllPlanets(dateObj, longitude, latitude, height);
var result = ephemeris.getAllPlanets(dateObj, 10.0014, 53.5653, 0);
console.log(result)

const PragueLatitude = 50.0736
const PragueLongitude = 14.4185

export function getSunEphemeris(date: Timestamp){
    // ephemeris.getPlanet(planetName, date, geodeticalLongitude, geodeticalLatitude, height)

    return ephemeris.getPlanet('sun',date.toDate(),PragueLatitude, PragueLongitude, 0).observed.sun
}

export function getJupiterEphemeris(date: Timestamp){
    return ephemeris.getPlanet('jupiter',date.toDate(),PragueLatitude, PragueLongitude, 0).observed.jupiter
}

/*
 console.log("get sun info:",getSunEphemeris(Timestamp.now()))
    console.log("degree: ",getDegree(getSunEphemeris(Timestamp.now()).apparentLongitudeDms30))

    console.log("get jupiter info:",getJupiterEphemeris(Timestamp.now()))
    console.log("degree: ",getDegree(getJupiterEphemeris(Timestamp.now()).apparentLongitudeDms30))
 */

