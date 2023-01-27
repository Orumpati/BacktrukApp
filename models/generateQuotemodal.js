//get the reuired libraries
/*const mongoose= require("mongoose");



//define the schema here
const generateQuoteSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   pickupLocation:{type: String, required: true},
   userNumber:{type:Number, required: true},
   dropLocation:{type: String, required: true},
   goodsType:{type: String, required: true},
   quantity:{type: Number, required: true},
   vehicleType:{type: String, required: true},
   loadCapacity:{type: String, required: true},
   expectedPrice:{type: Number, required: true},
   dateRequired:{type: String, required: true},
   quoteStatus:{type: String, required: true},
   quoteSentTo:{type: Array, required: true}
});


//export this mongoose module
module.exports = mongoose.model('generateQuote', generateQuoteSchema);*/




const mongoose = require('mongoose')

const loadSchema = new mongoose.Schema({

    OriginLocation:{
        type:String,
        //required:true
    },
    DestinationLocation:{
        type:String,
       // required:true
    },
    Number:{
        type:String,
       // required:true
    },
    product:{
        type:Array,
        //required:true
    },
    Quantity:{
        type:String,
        //required:true
    },
    
    vehicle:{
        type:Array,
        //required:true
    },

    loadCapacity:{
        type:String,
       // required:true
    },

    expectedPrice:{
        type:String,
       // required:true
    },

    date:{
        type:String,
        //required:true
    }


})

const load = mongoose.model('Item',loadSchema)

module.exports= load