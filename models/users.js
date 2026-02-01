const mongoose = require('mongoose') ;

const usersSchema = mongoose.Schema({
    name : {
        type : String , 
        required : true  
    },
    email : {
        type : String , 
        required : true ,
        unique : true 
    } ,
    password : {
        type : String
    },
    social_media : {
        type : String ,
        required : false 
    },
    refresh_token : {
        type : String 
    },
    access_token : {
        type : String
    }
} , { timestamps : true })


module.exports = mongoose.model("Users" , usersSchema ) ;