//get the reuired libraries
const mongoose= require("mongoose");

//introduce bigs array as part of this quote generate schema for accesing the bids later
const bidsData=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mobileNo:{type: Number},
    BidActivity: { type: Array },
    Bidprice: {type: Array},
    Negotiate:{type: Array},
    tentativefinalPrice:{type: Number},

    isAgentAccepted:{
        type:Boolean,
        default:false
    } ,
    isShipperAccepted:{
type:Boolean,
default:false
    } ,
    agentInitialBidSend:{
        type:Boolean,
        default:false
            } ,
            TohideAcceptBtn:{
                type:Boolean,
                default:false
                    },
                    BidStatus:{
                        type:String,
                        default:"open"
                    }
                    
                  
                     
                   
})

const VehicleData=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vehicleNo:{type: String},
    vehicleType:{type: String},
    OriginLocation:{type: String},
    vehicleCapacity:{type: String}, 
    agentNo:{type: String},
    BidID:{type: String}, 
    DriverName:{type: String},
    DriverNumber:{type: String},
    operatingRoutes:{type:Array},
    date:{type:String},
    isTrukOpenOrClose:{type:String},
    transporterName:{type:String},
    companyName:{type:String},
    mobileNumber:{type:String},
    city:{type:String}
})
const TruckMarketVehicleInformation= new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // TruckMarketVehicleNumber:{type: String},

    // TruckMarketVehicleOwnerMobNumber:{type: Number},
    // TruckMarketVehicleType:{type: String},
    // TruckMarketVehicleCapacity:{type: String},
    // TruckReeuestedPickupLocation:{type: String},
    // TruckRequestedDropOffLocation:{type: String}


    trukvehiclenumber:{type: String},
    OriginLocation:{type: String},
    trukoperatingRoutes:{type: Array},
    trukcapacity:{type: String},
    trukname:{type: String},
    trukOwnerNumber:{type:String}

  

})

const podInfo= new mongoose.Schema({
    waybill:{type: String},
    orderId:{type: String},
    ConsigneeName:{type: String},
    Address:{type: String},
    Finalstatus:{type: String},
    DeliveredOn:{type:String}
})

//define the schema here
const generateQuoteSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
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

// vehicle:{
//     type:Array,
//     required:true
// },

expectedPrice:{
    type:String,
   // required:true
},

date:{
    type:String,
    //required:true
},
 
typeOfPay:{
    type:String,
    //required:true
},
paymentTypeForOffline:{
    type:String
},
advance:{
    type:String
},
length:{
    type:String,
   // required:true
},

breadth:{
    type:String,
   // required:true
},

height:{
    type:String,
   // required:true
},

comments:{
    type:String,
   // required:true
},

data:{
    type:String
},
isTrukOpenOrClose:{
    type:String
},
typeOfHyva:{
    type:String
},
typeOfTrailer:{
    type:String
},
typeofTanker:{
    type:String
},
typeOfContainer:{
    type:String
},
dropupState:{
    type:String
},
pickupState:{
    type:String
},
isActive:{
    type:String,
    default:'Active'
},
userAcceptedPrice: {
    type: String,
    default:"0"
},
bidAcceptedTo:{
    type:Number
},
shareContact:{
    type:Boolean,
    default:false
   },
   initialAccept:{
    type:String,
    default:"notAccepted"
   },
   isPaymentCompleted:{
    type:Boolean,
    default:false
   },
   TohideNegoshit:{
    type:Boolean,
    default:false
   },
   paymentId:{
    type:String
   },
   DriverStatus:{
    type:String,
    default:'Active'
 },
 LoadId:{
    type:String
 },
 shipperAccept:{
type:Boolean,
default:false
 },
 ProofOfdelivery:[podInfo],
   quoteSentTo:{type: Array, required: true},
   bids:[bidsData],
   vehicleInformation:[VehicleData],
   TruckMarketVehicle:[TruckMarketVehicleInformation]
});


//export this mongoose module
module.exports = mongoose.model('generateQuote', generateQuoteSchema);