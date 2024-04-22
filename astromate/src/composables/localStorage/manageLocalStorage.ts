//import ephemeris from "../../../ephemeris/";
import * as ephemeris from '../../../ephemeris/';

export function manageLocalStorage(){
    function save(key: string, item: string){
        localStorage.setItem(key, item)
    }

    function getItem(key: string): string{
        const item = localStorage.getItem(key)
        if (item===null){
            throw new Error("Item is null. Wrong key.")
        }
        else {
            return item
        }
    }

    function removeItem(key:string) {
        localStorage.removeItem(key)

    }

    function clear(){
        localStorage.clear()

    }

    return {save, getItem, removeItem, clear}
}
