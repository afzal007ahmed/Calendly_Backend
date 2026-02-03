const users = require("../models/users");

const googleAuthMiddleware = async ( req , res , next ) => {
    try {
        const { id } = req.user ; 
        const user = await users.findOne({ _id : id } ) ; 
        if( !user.refresh_token ){
            throw new Error() ;
        }
        next() ;
    } catch (error) {
        res.status( error.statusCode || 403 ).send({
            code : "GOOGLE_ACCESS_REQUIRED" ,
            message : "google access required"
        })
    }
}


module.exports = { googleAuthMiddleware } ;