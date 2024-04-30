const { groups_collection} = require('./firebase-service');
const {users_collection} = require('./firebase-service')
const {profiles_collection} = require('./firebase-service')
const {Query, query, where, getDocs} = require("firebase/firestore");
const {getPlanetEphemeris} = require("./planetEphemeris")

// CONSTANTS
const CONJUNCTION = 10
const TRINE = 8
const SEXTILE = 6
const SQUARE = -5


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

// SEARCHED GROUPS
async function getOwnUsersFromFirestore(userId_string){
    try {
        const usersRef = await users_collection.where("userId",'==',userId_string).get()
        if(usersRef.empty){
            return []
        } else {
            let users = []
            usersRef.forEach((doc)=>{
                users.push({
                    category: doc.data().category,
                    color: doc.data().color,
                    groupId: doc.data().groupId,
                    groupName: doc.data().groupName,
                    useCase: doc.data().useCase,
                    userId: doc.data().userId
                })
            })
            return users
        }
    } catch (e) {
        console.error("Error fetching users: ", e)
    }
}

async function getMembersIdsByGroupId(groupId){
    try {
        const groupRef = groups_collection.doc(groupId);
        const doc = await groupRef.get();
        if (!doc.exists) {
            console.log('No such document!');
            return []
        } else {

             return doc.data().membersIDs
        }
    } catch (e) {
        console.error("Error fetching groups: ", e)
    }
}

// GROUPS
async function getOwnGroupsFromFirestore(userId_string){
    try {
        const groupsRef = await groups_collection
            .where("userId",'==',userId_string).get()

        if (groupsRef.empty){
            return []
        } else {
            let groups = []
            groupsRef.forEach((doc)=>{
                groups.push({
                    category: doc.data().category,
                    color: doc.data().color,
                    currentMembers: doc.data().currentMembers,
                    description: doc.data().description,
                    maxMembers: doc.data().maxMembers,
                    name: doc.data().name,
                    membersIDs: doc.data().membersIDs,
                    useCase: doc.data().useCase,
                    userId: doc.data().userId
                })
            })
            return groups
        }

    } catch (e) {
        console.error("Error fetching groups: ", e)
    }
}

async function addProfilesToGroups(groups) {
    for (let group of groups) {
        group.membersProfiles = await getProfiles(group.membersIDs);
    }
    return (groups)
}

async function getProfiles(profilesIds){
    let profiles = []
    try {
        const profilesRef = await profiles_collection.where('__name__', "in", profilesIds).get()
        if (profilesRef.empty) {
            return profiles
        } else {
            profilesRef.forEach((doc) => {
                console.log(doc.data().name)
                profiles.push({
                    date: doc.data().date,
                    place: doc.data().place
                })
            })
            return profiles
        }

    } catch (e) {
        console.error("Error fetching groups: ", e)
        return profiles
    }
}

// COMPATIBILITY
function calculateCompatibility(profiles){
    let count = 0
    let total = 0
    if(profiles.length < 2){
        return 0
    } else {
        for (let i = 0; i < profiles.length; i++) {
            for (let m = i + 1; m < profiles.length; m++) {
                total += compatibilityBetweenTwoProfiles(profiles[i],profiles[m])
                count++;
            }
        }
        return Math.round(total/count)
    }
}



function compatibilityBetweenTwoProfiles(profile1, profile2){
    console.log('profile 1: ', profile1)
    const profile1Planets = getPlanetEphemeris(profile1.date,profile1.place.latitude, profile1.place.longitude)
    const profile2Planets = getPlanetEphemeris(profile2.date,profile2.place.latitude, profile2.place.longitude)
    var allAspects = []

    const user1planetsArray = [profile1Planets.sun,profile1Planets.jupiter, profile1Planets.mars]
    const user2planetsArray = [profile2Planets.sun,profile2Planets.jupiter, profile2Planets.mars]

    user1planetsArray.forEach((user1planet)=>{
        user2planetsArray.forEach((user2planet)=>{
            allAspects.push(findAspects(user1planet, user2planet))
        })
    })


    const maximum = user1planetsArray.length * user2planetsArray.length * CONJUNCTION // 90
    const minimum = user1planetsArray.length * user2planetsArray.length * SQUARE // -45

    let numberOfConjunction = 0;
    let numberOfTrine = 0;
    let numberOfSextile = 0;
    let numberOfSquare = 0;

    allAspects.forEach((aspect)=>{
        if(aspect.conjunction){ numberOfConjunction++ }
        if(aspect.trine){ numberOfTrine++ }
        if(aspect.sextile){ numberOfSextile++ }
        if(aspect.square){ numberOfSquare++ }
    })
    const actualScore =
        numberOfConjunction*CONJUNCTION +
        numberOfSextile*SEXTILE +
        numberOfTrine*TRINE +
        numberOfSquare*SQUARE

    const score = ((actualScore-minimum)/(maximum-minimum))*100
    return Math.round(score)

}


function calculateAspect(planetDegrees1, planetDegrees2, min, max){
    let difference =  Math.abs(planetDegrees1 - planetDegrees2)
    difference = Math.min(difference, 360 - difference); // Normalize for crossing 0 degrees.
    return difference >= min && difference <= max
}

function findAspects(planetDegrees1, planetDegrees2){
    return {
        conjunction: calculateAspect(planetDegrees1, planetDegrees2, 0,5),
        sextile: calculateAspect(planetDegrees1, planetDegrees2,60,65),
        trine: calculateAspect(planetDegrees1,planetDegrees2, 120,125),
        square: calculateAspect(planetDegrees1,planetDegrees2, 90,95),
    }
}




module.exports = {getProfiles,getMembersIdsByGroupId,getOwnUsersFromFirestore,calculateCompatibility,addProfilesToGroups,getOwnGroupsFromFirestore,getOtherGroupsFromFirestore, filterGroups, getOtherUsersFromFirestore, filterUsers}
