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
        type : String , 
        required : true 
    },
    access_token : {
        type : String , 
        required : true 
    }
} , { timestamps : true })


module.exports = mongoose.model("Users" , usersSchema ) ;