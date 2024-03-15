const { groups_collection} = require('./firebase-service');
const {users_collection} = require('./firebase-service')


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

async function getOtherUsersFromFirestore(userID_string, useCase_string, category_string){
    try {
        return await users_collection
            .where("userId", "!=", userID_string)
            .where("useCase", "==", useCase_string)
            .where("category", "==", category_string)
            .get()
    } catch (e) {
        console.error("Error fetching groups: ", e)
    }
}

function filterGroups(userID, groupsFromFirebase_querySnapshot){
    console.log("inside filterGroupsMethod")
    var groups = []
    groupsFromFirebase_querySnapshot.forEach((doc)=>{
        //console.log(doc.id, '=>', doc.data())
        if(doc.data().wasSeenBy.includes(userID) === false
            && isCurrentMembersSmallerThanMax(doc.data().currentMembers, doc.data().maxMembers)){
            var newGroup = doc.data()
            newGroup['id'] = doc.id
            groups.push(newGroup)
        }
    })
    return groups
}

function isCurrentMembersSmallerThanMax(currentMembers_number, maxMembers_number){
    return currentMembers_number < maxMembers_number
}

function filterUsers(userID, usersFromFirebase_querySnapshot){
    var users = []
    console.log("inside filterUsers")
    usersFromFirebase_querySnapshot.forEach((doc)=>{
        if(doc.data().wasSeenBy.includes(userID) === false && doc.data().groupId === ""){
            console.log("groupId: ", doc.data().groupId)
            var newUser = doc.data()
            newUser['id'] = doc.id
            users.push(newUser)
        }
    })
    return users
}


module.exports = {getOtherGroupsFromFirestore, filterGroups, getOtherUsersFromFirestore, filterUsers}
