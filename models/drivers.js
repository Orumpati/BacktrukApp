//get the reuired libraries
const mongoose= require("mongoose");



//define the schema here
const UserDriverSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   TrukType:{type: String},
   TrukNumber:{type: String },
   TrukCapacity:{type: String},
   TrukImage:{type: String},
   RcImage:{type: String},
   DrivingLienceImage:{type: String},
   AadharImage:{type: String},
   PanImage:{type: String},
   DriverName:{type: String},
   DriverNumber:{type: String},
   Availability:{
     default:false,
     type:Boolean
   }

   
});


//export this mongoose module
module.exports = mongoose.model('Drivers', UserDriverSchema);