const { groups_collection} = require('./firebase-service');


async function getOtherGroupsFromFirestore(userID_string, useCase_string, category_string){
    try {
        const groupsRef = await groups_collection
                .where("userId","!=",userID_string)
                .where("useCase","==",useCase_string)
                .where("category","==",category_string)
                .get()
        groupsRef.forEach((doc) => {
                 console.log(doc.id, '=>', doc.data());
             });

        return groupsRef
    } catch (e) {
        console.error("Error fetching groups: ", e)
    }
}

function filterGroups(userID, groupsFromFirebase_querySnapshot){
    console.log("inside filterGroupsMethod")
    var groups = []
    groupsFromFirebase_querySnapshot.forEach((doc)=>{
        console.log(doc.id, '=>', doc.data())
        if(doc.data().wasSeenBy.includes(userID) === false){
            var newGroup = doc.data()
            newGroup['id'] = doc.id
            groups.push(newGroup)
        }
    })
    return groups
}

module.exports = {getOtherGroupsFromFirestore, filterGroups}
