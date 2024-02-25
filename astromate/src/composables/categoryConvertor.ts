import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
    sportCasesValues, colorsCases, colorsCasesValues} from '@/model/createGroupEnums'
import {ref} from 'vue'

export function convertCategory(useCaseparam: string, categoryParam: string) {
    var sportCaseThis: string = ""
    var workCaseThis: string = ""

    if (categoryParam == "") {
        return {sportCaseThis, workCaseThis}
    } if (useCaseparam == useCase.Work) {
        workCaseThis = categoryParam
        return {sportCaseThis, workCaseThis}
    } else {
        if (useCaseparam == useCase.Sport){
            sportCaseThis = categoryParam
            return {sportCaseThis, workCaseThis}
        } else {
            return {sportCaseThis, workCaseThis}
        }
    }
}