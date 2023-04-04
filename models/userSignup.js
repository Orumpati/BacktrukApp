//get the reuired libraries
const mongoose= require("mongoose");

const subObj={
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
    DriverNumber:{type: String, unique:false },
    Availability:{
      default:false,
      type:Boolean
    }

 } 

//define the schema here
const UserProfileSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,

//    password: { type: String, required: true },
   mobileNo: { type: Number, unique:true  },
   firstName:  {type:String, },
   lastName:  {type:String, },
   role:  {type:String, },
   city:  {type:String, },
   companyName:  {type:String},
   routes:{type: Array},
  // address:  subObj,


   addressType: { type: String  },
   doorNo:  {type:String },
   areaName:  {type:String },
   landMark:  {type:String },
   
   pincode:  {type:String},

   aboutCompany:{
      type:String
   },
   aadharVerify:{
    type:String
   },
   gstVerify:{
      type:String,
      default:'notVerified'
   },
   uniqueDeviceId:{
      type:String
   },
   firstTimeSignup:{
      type:String,
      default:"first"
   },
   Drivers:[subObj],
   TrukType:{type: String},
   TrukNumber:{type: String },
   TrukCapacity:{type: String},
   TrukImage:{type: String},
   RcImage:{type: String},
   DrivingLienceImage:{type: String},
   AadharImage:{type: String},
   PanImage:{type: String},
   DriverName:{type: String},
   Availability:{
     default:false,
     type:Boolean
   },
   userRole:{
      type:String
      
   }
   
});


//export this mongoose module
module.exports = mongoose.model('UserSignUp', UserProfileSchema);