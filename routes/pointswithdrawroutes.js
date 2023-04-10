//first import the express
const express = require("express");
//define the router
const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

const nodemailer = require('nodemailer')

const pointsWithdraw = require('../models/pointswithdraw')
const { DateTime } = require('luxon');

// Get the current date and time
const now = DateTime.local();
const formattedDateTime = now.toFormat('yyyy-MM-dd HH:mm:ss');


router.post('/pointsPost', async(req, res, next) => {        // want to create product details
    const pointsData = new pointsWithdraw({
        _id: new mongoose.Types.ObjectId,
        userName:req.body.userName,
        userNumber:req.body.userNumber,
        requestedPoints:req.body.requestedPoints,
        dateOfRequest:formattedDateTime
       
    });


    try {
        await pointsData.save()
        

        res.status(201).json({
            userData: pointsData
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }

})



router.post('/emailPoints', (req, res, next)=>{ 
 
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'neelisettylakshminarayana@gmail.com',
            pass:'vkovfqrwfiswrppm'  
        }
    
    })
    var mailOptions = {
        from: 'neelisettylakshminarayana@gmail.com',
         to: 'deepumettela007@gmail.com',
         subject: "Points Mail",
         text:req.body.text,
        // recipients:req.body.PhoneNumber
    }
    // if( req.body.Name ==''||  req.body.PhoneNumber=='' || req.body.To=='' || req.body.Query){
    //     console.log("Something Went Wrong");
    // }else{
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
           return console.log(err);
        }
        else{
            console.log("Email Sent"+ info.response)
        }
    })
    //}
    });


module.exports = router;