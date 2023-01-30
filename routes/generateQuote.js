//in this we will take the user from location and to location and create a algorithm to create a quote

// db.inventory.find( { areas: { $all: ["warangal", "delhi"] } } )


// db.inventory.insertMany([
//     { agent: "venkateshwara", qty: 4, areas: ["warangal", "bhupapally", "mahabubabad"], dim_cm: [ 14, 21 ] },
//     { agent: "mukta", qty: 5, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar"], dim_cm: [ 14, 21 ] },
//     { agent: "crosser", qty: 10, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "uppal", "vijayawada", "chennai"], dim_cm: [ 14, 21 ] },
//     { agent: "kalamani", qty: 8, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 22.85, 30 ] },
//     { agent: "balaji", qty: 20, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 10, 15.25 ] }
//  ]);

//first import the express
/*const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const quoteGenerate = require('../models/generateQuotemodal');
const { db } = require("../models/generateQuotemodal");
const UserSignup = require("../models/userSignup");



//post method goes here
router.post('/generateQuote',(req, res, next)=>{
    console.log("generate quotes api is called")

   

     //find the agents avaibale in the given locations
     UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
        console.log(doc.length)
         
        if(doc.length){ //if no provider available then throw error
        //get the list of peeple here loop throuh each doc and get the 
        var provider=[]; //provider be an empty array first
        for(item of doc){
           console.log(item.mobileNo);
           provider.push(item.mobileNo)
           console.log(provider)
        }

       //get the details for the quote generating
       const quote = new quoteGenerate({
        _id: new mongoose.Types.ObjectId,
        pickupLocation:req.body.pickupLocation,
        userNumber:req.body.userNumber,
        dropLocation:req.body.dropLocation,
        goodsType:req.body.goodsType,
        quantity:req.body.quantity,
        vehicleType:req.body.vehicleType,
        loadCapacity:req.body.loadCapacity,
        expectedPrice:req.body.expectedPrice,
        dateRequired:req.body.dateRequired,
        quoteStatus:req.body.quoteStatus,
        quoteSentTo:provider
           });

           quote.save().then( result=> {
            console.log(quote);
            //send mobile notification to every user in the array with their quote ID in notification
            res.status(200).json({
               message: "quote generate and sent succeesfully",
               status:"success",
               Id: result._id
            });
  
        }).catch(err => {
         console.log(err);
            res.status(500).json({
             error: err,
             status:"failed",
             message:"failed to generateQuote"
              });
         })

        }else{ //when no provider available
            res.status(200).json({
                status:"failed",
                message:"no providers available"
            })
        }

})

    



});


function sendQuote(orgin, destination){
  // userSignup.find()
  UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
    console.log(doc)
  })

  
}
 



module.exports = router;*/

const express = require('express');
const load = require('../models/generateQuotemodal')

const router = new express.Router()
const mongoose = require('mongoose');

router.post('/post', async (req, res) => {

    const Load = new load({
        _id:new mongoose.Types.ObjectId,
        OriginLocation:req.body.OriginLocation,
        DestinationLocation:req.body.DestinationLocation,
        Number:req.body.Number,
        product:req.body.product,
        Quantity:req.body.Quantity,
        vehicle:req.body.vehicle,
        loadCapacity:req.body.loadCapacity,
        expectedPrice:req.body.expectedPrice,
        date:req.body.date,
        typeOfPay:req.body.typeOfPay,
        length:req.body.length,
        breadth:req.body.breadth,
        height:req.body.height,
        comments:req.body.comments,
        data:req.body.data
         
    })
    
    try {
        await Load.save()
       
        res.status(201).json({
            registeredLoad:Load
            })
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
    });


    router.get('/allLoads', async(req, res) => {
        try {
            const Load = await load.find()

            
            res.status(200).json({
                TotalProducts:Load.length,
                Load
            })
        } catch (error) {
            res.status(401).send(error)
        }
    });



    module.exports = router;

