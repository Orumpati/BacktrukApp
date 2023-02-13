//get the reuired libraries
const mongoose= require("mongoose");

const truckdetails = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  truckImage:{type:String},
  truckName:{type:String},
  truckCapacity:{type:String}
})
const homeSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,

  
   AdsArray:{type:Array},
   TruksInfo:[truckdetails]

//    email:{type:String, required: true}
   
});


//export this mongoose module
module.exports = mongoose.model('homedetails',homeSchema);