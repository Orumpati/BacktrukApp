const mongoose = require('mongoose');

const contactUs = mongoose.Schema({

    Name: {
        type: String,
        //require: true
    },
    To: {
        type: String,
        //required: true
    },
    PhoneNumber: {
        type: String,
        //required: true
    },
    Query: {
        type: String,
        //required: true
    },
    Loadid: {
        type: String,
        //required: true
    },
   
})


module.exports = mongoose.model('MenuContactUs', contactUs)