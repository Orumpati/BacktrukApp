const mongoose = require('mongoose');
const generateQuoteSchema =mongoose.Schema({
    loadids :{
        type:String
    }
})

const Vehicle = mongoose.Schema({

    trukvehiclenumber: {
        type: String,
        //require: true
    },
    trukcurrentLocation: {
        type: String,
        //required: true
    },
    trukoperatingRoutes: {
        type: Array,
        //required: true
    },
    trukcapacity: {
        type: String,
        //required: true
    },
    trukname: {
        type: String,
    },
    trukdate: {
        type: String,
    },

    trukisActive:{
        type:String,
        default:"Active"
    },
    trukOwnerNumber:{
        type:String
    },
    trukpickupLocation:{
        type:String
    },
    trukdropLocation:{
        type:String
    },
    isTrukOpenOrClose:{
        type:String
    },
    attachedLoadIds:[generateQuoteSchema],
})


module.exports = mongoose.model('vehicle', Vehicle)