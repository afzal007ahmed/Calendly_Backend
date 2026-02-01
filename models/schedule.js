const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  duration: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
  },
  type_of_meeting: {
    type: String,
    required : true,
    min : 15 ,
    max : 720 
  },
  host_id: {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "Users" ,
    required : true 
  },
  subject: {
    type: String,
    required: true,
  }
} , { timestamps : true } ) ;

module.exports = mongoose.model("Schedule" , scheduleSchema) ; 
