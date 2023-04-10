const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const contactUs = require("../models/menuContactUs")

const nodemailer = require('nodemailer')

router.post('/emailnotification', (req, res, next)=>{ 
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'neelisettylakshminarayana@gmail.com',
            pass:'vkovfqrwfiswrppm'  
        }
    })
    var mailOptions = {
        from: 'neelisettylakshminarayana@gmail.com',
         to: req.body.To,
         subject: req.body.Name,
         //subject: req.body.PhoneNumber,
         text:[req.body.PhoneNumber,req.body.Name,req.boby.Query],
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


    
router.post('/addcontact', async(req, res, next) => {        // want to create product details
    const contact = new contactUs({
        Name: req.body.Name,
        To: req.body.To,
        PhoneNumber: req.body.PhoneNumber,
        Query: req.body.Query,
        Loadid:req.body.Loadid
     
    });
    try {
        await contact.save()
        

        res.status(201).json({
            addcontact: contact
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }

})

 module.exports = router;