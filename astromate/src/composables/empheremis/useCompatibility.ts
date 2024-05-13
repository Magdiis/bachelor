import {Profile} from "@/model/profile/Profile";
import {usePlanetEphemeris} from "@/composables/empheremis/useEmpheremis";

export type userPlanets = {
    sun: number,
    jupiter: number;
    mars: number;
}

export type aspects = {
    conjunction: boolean,
    trine: boolean,
    sextile: boolean,
    square: boolean
}

const CONJUNCTION = 10
const TRINE = 8
const SEXTILE = 6
const SQUARE = -5

function calculateAspect(planetDegrees1: number, planetDegrees2: number, min: number, max: number) {
    let difference = Math.abs(planetDegrees1 - planetDegrees2)
    difference = Math.min(difference, 360 - difference) // Normalize for crossing 0 degrees.
    return difference >= min && difference <= max
}

export function useCompatibility(user1: userPlanets, user2: userPlanets) {
    const allAspects: aspects[] = []

    function findAspects(planetDegrees1: number, planetDegrees2: number): aspects {
        return {
            conjunction: calculateAspect(planetDegrees1, planetDegrees2, 0, 5),
            sextile: calculateAspect(planetDegrees1, planetDegrees2, 60, 65),
            trine: calculateAspect(planetDegrees1, planetDegrees2, 120, 125),
            square: calculateAspect(planetDegrees1, planetDegrees2, 90, 95),
        }
    }

    const user1planetsArray = [user1.sun, user1.jupiter, user1.mars]
    const user2planetsArray = [user2.sun, user2.jupiter, user2.mars]

    user1planetsArray.forEach((user1planet) => {
        user2planetsArray.forEach((user2planet) => {
            allAspects.push(findAspects(user1planet, user2planet))
        })
    })

    const maximum = user1planetsArray.length * user2planetsArray.length * CONJUNCTION
    const minimum = user1planetsArray.length * user2planetsArray.length * SQUARE

    let numberOfConjunction = 0;
    let numberOfTrine = 0;
    let numberOfSextile = 0;
    let numberOfSquare = 0;

    allAspects.forEach((aspect) => {
        if (aspect.conjunction) { numberOfConjunction++ }
        if (aspect.trine) { numberOfTrine++ }
        if (aspect.sextile) { numberOfSextile++ }
        if (aspect.square) { numberOfSquare++ }
    })

    const actualScore =
        numberOfConjunction * CONJUNCTION +
        numberOfSextile * SEXTILE +
        numberOfTrine * TRINE +
        numberOfSquare * SQUARE

    function compatibilityResult(): number {
        const score = ((actualScore - minimum) / (maximum - minimum)) * 100
        return Math.round(score)
    }

    return {
        compatibilityResult, numberOfSquare, numberOfTrine, numberOfSextile, numberOfConjunction
    }
}

export function groupCompatibility(profiles: Profile[]): number {
    const planetEphemeris = usePlanetEphemeris()
    let count = 0
    let total = 0
    if (profiles.length < 2) {
        return 0
    } else {
        for (let i = 0; i < profiles.length; i++) {
            for (let m = i + 1; m < profiles.length; m++) {
                const userPlanets1 = planetEphemeris.getPlanetsEphemeris(profiles[i].date, profiles[i].place.latitude, profiles[i].place.longitude)
                const userPlanets2 = planetEphemeris.getPlanetsEphemeris(profiles[m].date, profiles[m].place.latitude, profiles[m].place.longitude)
                const {compatibilityResult} = useCompatibility(userPlanets1, userPlanets2)
                total += compatibilityResult()
                count++;
            }
        }
        return Math.round(total / count)
    }
}