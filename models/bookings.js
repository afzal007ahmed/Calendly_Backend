const mongoose = require('mongoose') ;


const bookingsSchema = mongoose.Schema({
    guest_name : {
        type : String , 
        required : true 
    },
    guest_email : {
        type : String , 
        required : true 
    },
    guest_note : {
        type : String 
    },
    from : {
        type : Number ,
        required : true 
    },
    to : {
        type : Number , 
        required : true 
    },
    schedule_id  : { 
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Schedule"
    },
    meeting_id : {
        type : String ,
        required : true 
    }
} , { timestamps : true }  ) ;



module.exports = mongoose.model("Bookings" , bookingsSchema ) ;