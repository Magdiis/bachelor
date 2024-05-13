const {getAuth} = require("firebase-admin/auth");


async function verifyToken(token){
    try {
        const decodedToken = await getAuth().verifyIdToken(token)
        if(decodedToken.uid.length > 0){
            return true
        }
    } catch (error) {
        console.error("Error authorization: ", error.message)
        return false
    }
}



module.exports = {verifyToken}
