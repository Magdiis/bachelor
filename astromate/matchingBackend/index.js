
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
     console.log(req.params.useCase)
    var body = {
        groups: []
    }
    fetchingFromFirestore.getOtherGroupsFromFirestore(req.params.userId, req.params.useCase, req.params.category).then(querySnapshot  =>{
        if(querySnapshot.size === 0){
            console.log("zero")
            // empty json
            res.json(body)
        } else {
            console.log("not zero")
            body.groups = fetchingFromFirestore.filterGroups(req.params.userId, querySnapshot)
            res.json(body)
        }
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



