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
        // service: 'gmail',
//         Outgoing Server Name: smtp.zoho.in
// Port: 465
// Security Type: SSL 
// Require Authentication: Yes
auth:{
    user:'neelisettylakshminarayana@gmail.com',
    pass:'vkovfqrwfiswrppm'  
}
        // host: 'smtppro.zoho.in',
        // secure: 'SSL',
        // port: 465,
        // auth: {
        //   user: 'jayadeep.mettela@ro-one.in',
        //   pass: 'pUxdfkTc9iLp',
        // },
    
    })
    var mailOptions = {
       
        from: 'neelisettylakshminarayana@gmail.com',
         to: 'info@trukapp.com',
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


    router.post('/reqestedHistory', (req, res, next) => {
        pointsWithdraw.find({ userNumber: req.body.userNumber }).select().exec().then(
            doc => {
                console.log(doc)
                //check if it has matching docs then send response
                if (doc) {
                    res.status(200).json({
                        Loads:doc.length,
                        data: doc,
                        message: "got the matching history based on the profile",
                        status: "success"
                    })
                } else {
                    res.status(400).json({
                        message: "no history found",
                        status: "no docs"
                    })
    
                }
            }
        ).catch(err => {
            res.status(400).json({
                message: "failed to get history",
                status: "failed",
                error: err
            })
        })
    })


module.exports = router;