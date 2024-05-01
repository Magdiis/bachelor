
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const fetchingFromFirestore = require("./fetchingFromFirestore")

var corsOptions = {
    origin: 'http://localhost:8100'
}

app.use(cors(corsOptions))


app.get('/', (req, res) => {
    res.send("Hello world")
})

app.get("/getOtherGroups/:userId/:useCase/:category", (req, res) => {

    var body = {
        groups: []
    }
    fetchingFromFirestore.getOtherGroupsFromFirestore(req.params.userId, req.params.useCase, req.params.category).then(querySnapshot  =>{
        if(querySnapshot.size === 0){

            // empty json
            res.json(body)
        } else {

            body.groups = fetchingFromFirestore.filterGroups(req.params.userId, querySnapshot)
            res.json(body)
        }
    })
})

app.get("/getOtherUsers/:userId/:useCase/:category",(req, res) => {
    var body = {
        users: []
    }
    fetchingFromFirestore.getOtherUsersFromFirestore(req.params.userId, req.params.useCase, req.params.category).then(querySnapshot => {
        if (querySnapshot.size === 0){
            res.json(body)
        } else {
            body.users = fetchingFromFirestore.filterUsers(req.params.userId, querySnapshot)
            res.json(body)
        }
    })
})

app.get("/getOwnGroups/:userId",async (req, res)=>{
    var body = {
        ownGroups: []
    }
    var groupsFromFirestore = []
    var groupsWithProfiles = []

    groupsFromFirestore = await fetchingFromFirestore.getOwnGroupsFromFirestore(req.params.userId)
    if(groupsFromFirestore.length < 1){
        res.json(body)
    } else {
        groupsWithProfiles = await fetchingFromFirestore.addProfilesToGroups(groupsFromFirestore)

        groupsWithProfiles.forEach((groupWithProfiles)=>{
                body.ownGroups.push({
                    id: groupWithProfiles.id,
                    category: groupWithProfiles.category,
                    color: groupWithProfiles.color,
                    currentMembers: groupWithProfiles.currentMembers,
                    description: groupWithProfiles.description,
                    maxMembers: groupWithProfiles.maxMembers,
                    name: groupWithProfiles.name,
                    membersIDs: groupWithProfiles.membersIDs,
                    useCase: groupWithProfiles.useCase,
                    userId: groupWithProfiles.userId,
                    compatibility: fetchingFromFirestore.calculateCompatibility(groupWithProfiles.membersProfiles)
                })
        })
        res.json(body)
    }
})

app.get("/getOwnUsers/:userId",async (req, res)=>{
    var body = {
        ownUsers: []
    }
    const usersFromFirestore = await fetchingFromFirestore.getOwnUsersFromFirestore(req.params.userId)
    if(usersFromFirestore.length < 1){
        res.json(body)
    } else {
        for (const user of usersFromFirestore) {
            const membersIds = user.groupId === '' ? [] : await fetchingFromFirestore.getMembersIdsByGroupId(user.groupId);
            const profiles = membersIds.length > 1 ?  await fetchingFromFirestore.getProfiles(membersIds) : []
            const compatibility = profiles.length > 1 ? await fetchingFromFirestore.calculateCompatibility(profiles) : 0
            body.ownUsers.push({
                id: user.id,
                category: user.category,
                color: user.color,
                groupId: user.groupId,
                groupName: user.groupName,
                useCase: user.useCase,
                userId: user.userId,
                compatibility: compatibility
            });
        }
        res.json(body)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



