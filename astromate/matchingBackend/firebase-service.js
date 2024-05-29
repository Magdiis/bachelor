
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

const serviceAccountTest = require('./serviceAccountKeyTest.json');

// initializeApp({
//     credential: cert(serviceAccount)
// })

// TEST
initializeApp({
 credential: cert(serviceAccountTest)
})

 const db = getFirestore()

 const groups_collection = db.collection('groups')
 const users_collection = db.collection('users')
 const decision_collection = db.collection('decision')
 const profiles_collection = db.collection('profiles')

module.exports= {profiles_collection, groups_collection, users_collection, decision_collection}