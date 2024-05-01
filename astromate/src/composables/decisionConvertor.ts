import { Decision } from "@/model/Decision";

export function decisionConvertor() {
    
    function returnDecisionIDs(decisions: Decision[]):string[]{
        var ids: string[] = []
        decisions.forEach((d)=>{
            ids.push(d.id)
        })

        return ids
    }

    return {returnDecisionIDs}
}