const mongoose = require ('mongoose');

const adminData = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    mobileNo:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String
    }



})

module.exports = mongoose.model('adminData', adminData)