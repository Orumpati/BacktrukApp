//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const UserSignup = require('../models/userSignup');


//post method goes here
router.post('/signup', [body('email').isEmail().normalizeEmail()],(req, res, next)=>{
    console.log("User profile is called")

    const userSignup = new UserSignup({
        _id: new mongoose.Types.ObjectId,
        userName: req.body.userName,
        //password: req.body.password,
        mobileNo: req.body.mobileNo,
        // address:  req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // email: req.body.email
        role:req.body.role,
        city:req.body.city,
        companyName :req.body.companyName,
        aadharVerify:'notVerified',
        routes:req.body.routes,
        uniqueDeviceId:req.body.uniqueDeviceId
           });

     var mobileNo = req.body.mobileNo;
  //first check if user is alredy existed 
  UserSignup.findOne({mobileNo:mobileNo}).select().exec().then(doc =>{

    if(doc == null){ //if no user found then create new user
        userSignup.save().then( result=> {
            res.status(200).json({
               message: "User signed up susccessfully",
               status:"success",
               Id: result._id,
               selectType:result.role
            });
  
     }) .catch(err => {
        console.log(err);
        res.status(500).json({
             error: err,
             status:"faileds"
              });
         })

    }else{
        res.status(500).json({message:"user aleredy exists",
                              status:"failed"
    
                             })
    }
    

    });


});
 


//get all the register data
router.get('/getRegisterData',async(req, res, next)=> {
    UserSignup.find((err,docs) =>{
        if(!err){
            res.status(200).json({
                message:"your register data",
                data:docs
            });
        }
        
    })

})



router.post('/login', (req, res, next)=>{
  //  const username = req.params.username;
  //  const password = req.params.password;
     
   var mobileNo=req.body.mobileno;
    console.log(mobileNo)
   UserSignup.findOne({mobileNo:mobileNo}).select().exec().then( doc => {
    console.log(mobileNo)
    var user  = req.body.mobileno;
    ///var pass  = req.body.password;
    
    //after getting the doc compare username and password
    if(user == doc.mobileNo){
      res.status(200).json({Authentication: doc._id,
                             message: "Success",
                            userProfile:doc})
    }
    else
    { 
        res.status(400).json({ 
            Authentication: 'Failed to login please check username and password',
            message:'failed'
                            });

    }
   }).catch(err => {
       console.log(err);
       res.status(500).json({error: err});
   });


});




//get user profile
router.get('/:username', (req, res, next) =>{
    UserSignup.findOne({username:req.params.username})
    .exec()
    .then(doc =>{
     
        res.status(200).json({
            userName: doc.username,
            FirstName: doc.firstName,
            lastName: doc.lastName,
            mobileno: doc.mobileNo,
            address: doc.address
           });
 
    })
    .catch(err =>{
        res.status(500).json({
          error: err,
          message:"profile Not Found"
        });
    });
 
     
 });
 

//put profile details based on login id
router.put('/putprofile/:id',(req, res)=>{
    /* if(!ObjectId.isValid(req.params.id))
     return res.status(400).send(`no record with id :${req.params.id}`);*/
   var data=  {addressType :req.body.addressType,
     
    doorNo:req.body.doorNo,
    
    
        areaName :req.body.areaName,
        landMark:req.body.landMark,
       city:req.body.city,
       pincode:req.body.pincode,
       
     };

 
     UserSignup.findByIdAndUpdate(req.params.id,
         {$set:
             data
         }  , {new: true},(err,docs)=>{
             if(!err){
                 res.send(docs);
             }else{
                 console.log('error in  update:' +JSON.stringify(err,undefined,2));
             }
         })
     })

     //put profile details based on login id
router.put('/putroutes/:id',(req, res)=>{
    /* if(!ObjectId.isValid(req.params.id))
     return res.status(400).send(`no record with id :${req.params.id}`);*/
   var data=  {
    
    routes:req.body.routes
       
     };

 
     UserSignup.findByIdAndUpdate(req.params.id,
         {$set:
             data
         }  , {new: true},(err,docs)=>{
             if(!err){
                 res.send(docs);
             }else{
                 console.log('error in  update:' +JSON.stringify(err,undefined,2));
             }
         })
     })


     router.get('/getprofiledetails/:_id',async(req, res, next)=> {
  
        let query = {_id: req.params._id};
    
        UserSignup.find(query).exec().then(async docs =>{
        
    
        
        try {
          
                res.status(200).json({
                    message:"your profile data",
                    data :docs, 
            
                });
           
        
        }catch(err){
            console.log(err)
        }
        }).catch(err=>{
            console.log(err)
        })
    
    })
    

    //update profile
    router.put('/updateprofile/:_id',(req, res)=>{
       // var mobileNo = req.body.mobileNo ;
        /* if(!ObjectId.isValid(req.params.id))
         return res.status(400).send(`no record with id :${req.params.id}`);*/
      var data=  req.body;
    
      // UserSignup.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{

       // var em = req.body.mobileNo;
       // if(em == doc.mobileNo){
            UserSignup.findByIdAndUpdate(req.params._id,
                {$set:
                    data
                }  , {new: true},(err,docs)=>{
                    if(!err){
                        res.send(docs);
                    }else if(err.codeName == 'Duplicatekey'){
                               console.log('num alraedy exist')
                    }
                    else{
                        console.log('error in status  update:' +JSON.stringify(err,undefined,2));
                    }
                })
   
               
           
       // }
   
           /* else{
            res.status(400).json({Authentication:"Mobile NO already exist",
                   message:"failed",
                   status:"failed",
               
                   
           });
         
        }*/

    
    })


        // })


        
      //update profile
      router.put('/updatedeviceid/:_id',(req, res)=>{
        // var mobileNo = req.body.mobileNo ;
         /* if(!ObjectId.isValid(req.params.id))
          return res.status(400).send(`no record with id :${req.params.id}`);*/
       var data=  req.body;
     
       // UserSignup.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{
 
        // var em = req.body.mobileNo;
        // if(em == doc.mobileNo){
             UserSignup.findByIdAndUpdate(req.params._id,
                 {$set:
                     data
                 }  , {new: true},(err,docs)=>{
                     if(!err){
                         res.send(docs);
                     }else if(err.codeName == 'Duplicatekey'){
                                console.log('num alraedy exist')
                     }
                     else{
                         console.log('error in status  update:' +JSON.stringify(err,undefined,2));
                     }
                 })
    
                
            
        // }
    
            /* else{
             res.status(400).json({Authentication:"Mobile NO already exist",
                    message:"failed",
                    status:"failed",
                
                    
            });
          
         }*/
 
     
     })     
        
    

module.exports = router;