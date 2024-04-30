
import {Coordinates} from "@/composables/geolocation/useGeolocation";


export interface Profile {
    id:string,
    name: string,
    description: string,
    date: string,
    place: Coordinates,
    temperament: string,
    thinking: string,
    plan: string,
    handy: string
}

export enum Temperament {
    extrovert = 'extrovert',
    introvert = 'introvert',
}

export const temperamentValues = Object.values(Temperament)

export enum Thinking {
    rational = 'rozumový',
    emotional = 'citový',
}

export const thinkingValues = Object.values(Thinking)

export enum Plan {
    plan = 'plánovitý',
    chaos = 'spontánní'
}

export const planValues = Object.values(Plan)

export enum Handy {
    handy ='praktický',
    creative ='kreativní',
}

export const handyValues = Object.values(Handy)



