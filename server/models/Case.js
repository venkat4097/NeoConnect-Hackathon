const mongoose = require("mongoose")

const CaseSchema = new mongoose.Schema({

 trackingId:String,

 category:String,

 department:String,

 location:String,

 severity:String,

 description:String,

 status:{
  type:String,
  default:"New"
 },

 assignedTo:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 createdBy:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 anonymous:Boolean,

 notes:String,

  isPublic:{
    type:Boolean,
    default:false
  },

  lastResponseAt:{
    type:Date,
    default:Date.now
  },

  actionTaken:String,

  outcome:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

})

module.exports = mongoose.model("Case",CaseSchema)