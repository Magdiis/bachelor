import {useCase, useCasesValues, workCases, workCasesValues, SportCases, 
    sportCasesValues, colorsCases, colorsCasesValues} from '@/model/group/createGroupEnums'
import {ref} from 'vue'

export function convertCategory(useCaseParam: string, categoryParam: string) {
    var sportCaseThis: string = ""
    var workCaseThis: string = ""
    if (categoryParam == "") {
        return {sportCaseThis, workCaseThis}
    } if (useCaseParam == useCase.Work) {
        workCaseThis = categoryParam
        return {sportCaseThis, workCaseThis}
    } else {
        if (useCaseParam == useCase.Sport){
            sportCaseThis = categoryParam
            return {sportCaseThis, workCaseThis}
        } else {
            return {sportCaseThis, workCaseThis}
        }
    }
}

export function returnCategory(useCaseParam:string, workCaseParam:string, sportCaseParam:string): string {
    // if(useCaseParam == useCase.Work){
    //     return workCaseParam
    // } if (useCaseParam == useCase.Sport) {
    //     return sportCaseParam
    // } else {
    //     return ""
    // }
    switch (useCaseParam) {
        case useCase.Work:
            return workCaseParam

        case useCase.Sport:
            return sportCaseParam

        case useCase.Friendship:
            return useCase.Friendship

        case useCase.Relationship:
            return useCase.Relationship
        default:
            console.log(`Sorry, we are out of ${useCaseParam}.`);
            return ""
    }

}