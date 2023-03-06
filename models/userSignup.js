//get the reuired libraries
const mongoose= require("mongoose");

// const subObj={
//     addressType:{type: String, required:true},
//     doorNo:{type: String, required: true},
//     areaName:{type: String, required:true},
//     landMark:{type: String, required:true},
//     city:{type: String, required:true},
//     pincode:{type: String}
// } 

//define the schema here
const UserProfileSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,

//    password: { type: String, required: true },
   mobileNo: { type: Number, unique:true,  },
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

 
   aadharVerify:{
    type:String
   },
   gstVerify:{
      type:String,
      default:'notVerified'
   },
   uniqueDeviceId:{
      type:String
   }
//    email:{type:String, required: true}
   
});


//export this mongoose module
module.exports = mongoose.model('UserSignUp', UserProfileSchema);