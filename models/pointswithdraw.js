const mongoose = require('mongoose');

const points = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        //require: true
    },
    userNumber: {
        type: String,
        //required: true
    },
    requestedPoints: {
        type: String,
        //required: true
    },
    dateOfRequest: {
        type: String,
        //required: true
    }
})


module.exports = mongoose.model('points', points)