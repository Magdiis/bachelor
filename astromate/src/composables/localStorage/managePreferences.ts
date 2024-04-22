import {Preferences} from '@capacitor/preferences'

/*
right version
npm i @capacitor/camera@5.0.6
npm i @capacitor/preferences@5.0.6   ??

 */
export default function managePreferences(){

    async function setPreferences(key: string, value: any){
        await Preferences.set({
            key: key,
            value: value
        })
    }

    async function getFromPreferences(key: string):Promise<any>{
        const {value} = await Preferences.get({
            key: key
        })
        return value
    }

    async function removePreferences(key: string) {
        await Preferences.remove({
            key: key
        })
    }
    return {setPreferences, getFromPreferences, removePreferences}
}

export enum preferencesKeys{
    isUserLogged = "isUserLogged",  // boolean
    loggedUserID = "loggedUserID"  // string
}