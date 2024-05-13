import {describe, expect, test} from "vitest";
import {useCompatibility, userPlanets} from "../../src/composables/empheremis/useCompatibility";


describe('Compatibility', () => {
    test('compatibility 100 % - all aspects are conjunctions', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const userPlanets2: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const {compatibilityResult,numberOfConjunction} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(100)
        expect(numberOfConjunction).toBe(9)
    })

    test('compatibility 0 % - all aspects are squares', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const userPlanets2: userPlanets = {jupiter: 90, mars: 90, sun: 90}
        const {compatibilityResult, numberOfSquare} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(0)
        expect(numberOfSquare).toBe(9)
    })

    test('compatibility 33 % - no aspects', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const userPlanets2: userPlanets = {jupiter: 78, mars: 78, sun: 78}
        const {compatibilityResult, numberOfSquare,numberOfConjunction,
            numberOfSextile,numberOfTrine} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(33)
        expect(numberOfSquare).toBe(0)
        expect(numberOfTrine).toBe(0)
        expect(numberOfConjunction).toBe(0)
        expect(numberOfSextile).toBe(0)
    })

    test('compatibility 100 % - deviation, crossing 360 degrees', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 1, sun: 3}
        const userPlanets2: userPlanets = {jupiter: 360, mars: 359, sun: 358}
        const {compatibilityResult, numberOfConjunction} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(100)
        expect(numberOfConjunction).toBe(9)
    })

    test('compatibility 73 % - all aspects are sextiles', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const userPlanets2: userPlanets = {jupiter: 60, mars: 62, sun: 64}
        const {compatibilityResult, numberOfSextile} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(73)
        expect(numberOfSextile).toBe(9)
    })

    test('compatibility 87 % - all aspects are trines', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 0, sun: 0}
        const userPlanets2: userPlanets = {jupiter: 120, mars: 121, sun: 123}
        const {compatibilityResult, numberOfTrine} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(87)
        expect(numberOfTrine).toBe(9)
    })

    test('compatibility 47 % - one conjunction, one square, one sextile, one trine', () => {
        const userPlanets1: userPlanets = {jupiter: 0, mars: 90, sun: 77}
        const userPlanets2: userPlanets = {jupiter: 120, mars: 90, sun: 60}
        const {compatibilityResult, numberOfTrine,numberOfSquare,numberOfSextile,numberOfConjunction} = useCompatibility(userPlanets1,userPlanets2)
        expect(compatibilityResult()).toBe(47)
        expect(numberOfTrine).toBe(1)
        expect(numberOfSquare).toBe(1)
        expect(numberOfSextile).toBe(1)
        expect(numberOfConjunction).toBe(1)
    })



})
