//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const Userprofile = require('../models/profilemodel');




router.post('/addprofile',(req, res, next)=>{
    console.log("User profile is called")

    const userProfile = new Userprofile({
        _id: new mongoose.Types.ObjectId,
       // username: req.body.username,
        //password: req.body.password,
        addressType: req.body.addressType,
        // address:  req.body.address,
        doorNo: req.body.doorNo,

        // email: req.body.email
        areaName:req.body.areaName,
        landMark:req.body.landMark,
        city:req.body.city,
        pincode :req.body.pincode,
        

           });

     var doorNo = req.body.doorNo;
  //first check if user is alredy existed 
  Userprofile.findOne({doorNo:doorNo}).select().exec().then(doc =>{

    if(doc == null){ //if no user found then create new user
        userProfile.save().then( result=> {
            res.status(200).json({
               message: "User Profile added susccessfully",
               status:"success",
               Id: result._id,
            
            });
  
     }) .catch(err => {
        console.log(err);
        res.status(500).json({
             error: err,
             status:"faileds"
              });
         })

    }else{
        res.status(200).json({message:"user Profile aleredy exists",
                              status:"failed"
    
                             })
    }
    

    });


});
module.exports = router;