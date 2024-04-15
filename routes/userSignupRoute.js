//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3-v2');
//express validator
const { body } = require('express-validator'); //use express validator for few required things
const OneSignal=require('@onesignal/node-onesignal')
//import the schema here
const UserSignup = require('../models/userSignup');
const userSignup = require("../models/userSignup");
const Drivers =require('../models/drivers');
const drivers = require("../models/drivers");
const jwtAuth = require('../jwtAuth');
const checkSubscription = require('../routes/subscription');



aws.config.update({
    secretAccessKey: 'YJTJljNdeg1IgSWZKcY4aPd4ObTgeAyN3+hBjceF',
    accessKeyId: 'AKIAQV7PAMQ75KVD3CZM',
    region: 'ap-south-1',
    

});
const BUCKET = '3-nodejs123';
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
})
//post method goes here
router.post('/signup', [body('email').isEmail().normalizeEmail()],(req, res, next)=>{
    console.log("User profile is called")
    const userSignup = new UserSignup({
        _id: new mongoose.Types.ObjectId,
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
        aboutCompany:req.body.aboutCompany,
        uniqueDeviceId:req.body.uniqueDeviceId, 
        referalCode:req.body.referalCode,
        signupReferalCode:req.body.signupReferalCode,
        SignupDate:req.body.SignupDate,
        TotalCoins:req.body.TotalCoins
      
           });

     var mobileNo = req.body.mobileNo;
 
  //first check if user is alredy existed 
  UserSignup.findOne({mobileNo:mobileNo }).select().exec().then(doc =>{

    if(doc == null){ //if no user found then create new user
        userSignup.save().then( result=> {
            sendnotificationforplacebid(req.body.firstName + req.body.lastName,"You Registered As",req.body.role,req.body.uniqueDeviceId)
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
        res.status(500).json({message:"user already exists",
                              status:"failed"
    
                             })
    }
    

    });


});
 

//add driver

router.post('/signupDriver',(req, res, next)=>{
    console.log("User ")
    const driverSignup = new UserSignup({
        _id: new mongoose.Types.ObjectId,

        uniqueDeviceId:req.body.uniqueDeviceId, 
        TrukType:req.body.TrukType,
        TrukNumber:req.body.TrukNumber,
        TrukCapacity:req.body.TrukCapacity,
        TrukImage:req.body.TrukImage,
        RcImage:req.body.RcImage,
        DrivingLienceImage:req.body.DrivingLienceImage,
        AadharImage:req.body.AadharImage,
        PanImage:req.body.PanImage,
        DriverName:req.body.DriverName,
        mobileNo:req.body.mobileNo,
        userRole:req.body.userRole
           });

   
     var mobileNo = req.body.mobileNo;
  //first check if user is alredy existed 
  UserSignup.findOne({ mobileNo:mobileNo}).select().exec().then(doc =>{
console.log(doc)
    if(doc == null){ //if no user found then create new user
        driverSignup.save().then( result=> {
       //     sendnotificationforplacebid(req.body.firstName + req.body.lastName,"You Registered As",req.body.role,req.body.uniqueDeviceId)
            res.status(200).json({
               message: "Driver signed up susccessfully",
               status:"success",
               Id: result._id,
               selectType:result.userRole
            });
  
     }) .catch(err => {
        console.log(err);
        res.status(500).json({
             error: err,
             status:"faileds"
              });
         })

    }else{
        res.status(500).json({message:"user already exists",
                              status:"failed"
    
                             })
    }
    

    });


});

//transporter details who attached the particular driver

router.post('/findtransporterbydrivers',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{

  

    
    //     console.log(new Date().getTime());
      var query= {"Drivers.DriverNumber":req.body.mobileNo}  //quote id and truker mobile no  always Agent mobile NO
   

   

      UserSignup.find(query).select().exec().then(
         doc=>{
             console.log(doc)
             //check if it has matching docs then send response
             if(doc){
                //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
             res.status(200).json({
                 data: doc,
                 message:"got the matching transporter based on the profile",
                 status:"success"
             })
           
           
         }else{
             res.status(400).json({
                 message:"no matching docs found",
                 status:"no docs"
             })
 
         }

         }
     ).catch(err=>{
         res.status(400).json({
             message:"no load found",
             status: "failed",
             error:err
         })
     })
    }) 
 
 


//get all the register data
router.get('/getRegisterData',jwtAuth.verifyToken,async(req, res, next)=> {
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
router.get('/:username',jwtAuth.verifyToken, checkSubscription,(req, res, next) =>{
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
router.put('/putprofile/:id',jwtAuth.verifyToken,(req, res)=>{
    /* if(!ObjectId.isValid(req.params.id))
     return res.status(400).send(`no record with id :${req.params.id}`);*/
   var data=  {
    addressType :req.body.addressType,
     
        doorNo:req.body.doorNo,
        aadharVerify:req.body.aadharVerify,
        gstVerify:req.body.gstVerify,
        areaName :req.body.areaName,
        landMark:req.body.landMark,
       city:req.body.city,
       pincode:req.body.pincode,
       signupDateString:req.body.signupDateString,
       subscriptionType:req.body.subscriptionType,
       subscriptionStartDateString:req.body.subscriptionStartDateString,
       subscriptionEndDateString:req.body.subscriptionEndDateString,
       externalids:req.body.externalids
       
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
router.put('/putroutes/:id',jwtAuth.verifyToken,(req, res)=>{
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


     router.get('/getprofiledetails/:_id',checkSubscription,async(req, res, next)=> {
  
        let query = {_id: req.params._id};
    
        UserSignup.find(query).exec().then(async docs =>{
        
    
        
        try {
          
                res.status(200).json({
                    message:"your profile data",
                    data :docs, 
                    doclen:docs.length
            
                });
           
        
        }catch(err){
            console.log(err)
        }
        }).catch(err=>{
            console.log(err)
        })
    
    })
    

    //update profile
    // router.put('/updateprofile/:_id',jwtAuth.verifyToken,checkSubscription,(req, res)=>{
    //    // var mobileNo = req.body.mobileNo ;
    //     /* if(!ObjectId.isValid(req.params.id))
    //      return res.status(400).send(`no record with id :${req.params.id}`);*/
    //   var data=  req.body;
    
    //   // UserSignup.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{

    //    // var em = req.body.mobileNo;
    //    // if(em == doc.mobileNo){
    //         UserSignup.findByIdAndUpdate(req.params._id,
    //             {$set:
    //                 data
    //             }  , {new: true},(err,docs)=>{
    //                 if(!err){
    //                     res.send(docs);
    //                 }else if(err.codeName == 'Duplicatekey'){
    //                            console.log('num alraedy exist')
    //                 }
    //                 else{
    //                     console.log('error in status  update:' +JSON.stringify(err,undefined,2));
    //                 }
    //             })
   
               
           
    //    // }
   
    //        /* else{
    //         res.status(400).json({Authentication:"Mobile NO already exist",
    //                message:"failed",
    //                status:"failed",
               
                   
    //        });
         
    //     }*/

    
    // })
    router.put("/update-user/:_id", async (req, res) => {
        const updates = Object.keys(req.body);
        // const userId = req.params.id;
        const allowedUpdates = [
          "firstName",
          "lastName",
          "role",
          "city",
          "companyName",
          "routes",
          "addressType",
          "doorNo",
          "areaName",
          "landMark",
          "pincode",
          "aboutCompany",
          "aadharVerify",
          "gstVerify",
          "uniqueDeviceId",
          "firstTimeSignup",
          "Drivers",
          "TrukType",
          "TrukNumber",
          "TrukCapacity",
          "TrukImage",
          "RcImage",
          "DrivingLienceImage",
          "AadharImage",
          "PanImage",
          "DriverName",
          "Availability",
          "userRole",
          "referalCode",
          "signupReferalCode",
          "refferedTo",
          "SignupDate",
          "subscriptionType",
          "subscriptionStartDate",
          "subscriptionEndDate",
          "payment_history",
          "accDetails",
          "TotalCoins",
          "PermanetCoins",
          "gstDetails",
          "widthdrawStatus"
        ];
        
        const isValidOperation = updates.every((update) =>
          allowedUpdates.includes(update)
        );
      
        if (!isValidOperation) {
          return res.status(400).json({ error: "Invalid updates" });
        }
      
        try {
          const userDetails = await UserSignup.findById(req.params._id);
      
          if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
          }
      
          updates.forEach((update) => {
            userDetails[update] = req.body[update];
          });
      
          const updatedDetails = await userDetails.save();
      
          res.json({
            updatedDetails,
            message: "User details updated successfully",
          });
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        }
      });
      

        // })


        
      //update profile
      router.put('/updatedeviceid/:_id',jwtAuth.verifyToken,(req, res)=>{
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
        
     router.post('/AddDrivers',jwtAuth.verifyToken, checkSubscription,(req, res, next)=>{

        //     console.log(new Date().getTime());
          var query= {_id:req.body._id}  //Transporter userSignup Id
       const body ={
        TrukType:req.body.TrukType,
        TrukNumber:req.body.TrukNumber,
        TrukCapacity:req.body.TrukCapacity,
        TrukImage:req.body.TrukImage,
        RcImage:req.body.RcImage,
        DrivingLienceImage:req.body.DrivingLienceImage,
        AadharImage:req.body.AadharImage,
        PanImage:req.body.PanImage,
        DriverName:req.body.DriverName,
        DriverNumber:req.body.DriverNumber,
       }
   
       var data=   { $push: { Drivers: body }}
       var DriverNumber = req.body.DriverNumber;
       //first check if user is alredy existed 
       UserSignup.findOne({ DriverNumber:DriverNumber}).select().exec().then(doc =>{
     console.log(doc)
         if(doc == null){ //if no user found then create new user
         userSignup.findOneAndUpdate(query,data).select().exec().then(
             doc=>{
                 console.log(doc)

                 if(doc){
                    //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                 res.status(200).json({
                     data: doc,
                     message:"Driver added Successfull",
                     status:"success"
                 })
               
               
             }else{
                 res.status(400).json({
                     message:"no matching docs found",
                     status:"no docs"
                 })
     
             }
            

             }
         ).catch(err=>{
             res.status(400).json({
                 message:"failed to Add Drivers",
                 status: "failed",
                 error:err
             })
         })
        }else{
            res.status(500).json({message:"user aleredy exists",
                                  status:"failed"
        
                                 })
        }
        
    
        });
     } )


     router.post('/updateAvailability',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{
        
            //     console.log(new Date().getTime());
              var query= {"_id":req.body._id,"Drivers.DriverNumber":req.body.DriverNumber}  //quote id and truker mobile no  always Agent mobile NO
           
        
               //newUpdate query for bids
               var DataToBids={
                              $set:{"Drivers.$.Availability":req.body.Availability },
                    
                            }
      console.log(DataToBids)
             userSignup.findOneAndUpdate(query,DataToBids).select().exec().then(
                 doc=>{
                     console.log(doc)
                     //check if it has matching docs then send response
                     if(doc){
                       // sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                     res.status(200).json({
                         data: doc,
                         message:"status Updated",
                         status:"success"
                     })
                   
                   
                 }else{
                     res.status(400).json({
                         message:"no matching docs found",
                         status:"no docs"
                     })
         
                 }
    
                 }
             ).catch(err=>{
                 res.status(400).json({
                     message:"failed to Update",
                     status: "failed",
                     error:err
                 })
             })
            }) 
         

            router.post('/addnewDrivers',jwtAuth.verifyToken,checkSubscription, (req, res, next) => {
                const newdriber =new drivers({
                    _id:new mongoose.Types.ObjectId,
                    TrukType:req.body.TrukType,
                    TrukNumber:req.body.TrukNumber,
                    TrukCapacity:req.body.TrukCapacity,
                    TrukImage:req.body.TrukImage,
                    RcImage:req.body.RcImage,
                    DrivingLienceImage:req.body.DrivingLienceImage,
                    AadharImage:req.body.AadharImage,
                    PanImage:req.body.PanImage,
                    DriverName:req.body.DriverName,
                    DriverNumber:req.body.DriverNumber
                })
                newdriber.save().then(
                    doc => {
                        console.log(doc)
                        //check if it has matching docs then send response
                        if (doc) {
                            res.status(200).json({
                                Loads:doc.length,
                                data: doc,
                                message: "driver added",
                                status: "success"
                            })
                        } else {
                            res.status(400).json({
                                message: "no matching lo found",
                                status: "no docs"
                            })
            
                        }
                    }
                ).catch(err => {
                    res.status(400).json({
                        message: "failed to add driver",
                        status: "failed",
                        error: err
                    })
                })
            })


        //upload file path  to hospitaldatas in mongodb 
        router.post('/uploadImages/:id', upload.single('file'),  function (req, res, next) {
        
    
           // res.send('Successfully uploaded ' + req.file.location + ' location!')

            var data=  {
                DrivingLienceImage:req.file.location,
        
            };
             userSignup.findByIdAndUpdate(req.params.id,
                    {$set:
                        data
                    }  , {new: true},(err,docs)=>{
                        if(!err){
                            res.send(docs);
                        }else{
                            console.log('error in file upload:' +JSON.stringify(err,undefined,2));
                        }
                    })
                
            //await s3bucket.update({filePath:req.file.location})
            //await s3bucket.create({filePath:req.file.location});
        })


     async function sendnotificationforplacebid(mess,Name,BidPrice,uniqId){
    console.log(uniqId)
        const ONESIGNAL_APP_ID = '79da642e-49a6-4af9-8e6e-252680709d15';
    
    const app_key_provider = {
        getToken() {
            return 'ZjA4ZTMyOGEtOTEzMy00MzQyLTg2MmItYWM3YTExMTM2YzI2';
        }
    };
    
    const configuration = OneSignal.createConfiguration({
        authMethods: {
            app_key: {
                tokenProvider: app_key_provider
            }
        }
    });
    const client = new OneSignal.DefaultApi(configuration);
    
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;
    //notification.included_segments = ['Subscribed Users'];
    //notification.include_external_user_ids=["86744b78-55c9-42a7-92ee-5d93e1434d2b"];
    notification.include_external_user_ids = uniqId;
    notification.contents = {
        en:  mess +" "+Name+" "+BidPrice
    };
    const {id} = await client.createNotification(notification);
    
    const response = await client.getNotification(ONESIGNAL_APP_ID, id);
    console.log(response)
   // res.json(response)
    
    }


    
// router.get('/allQuotes',jwtAuth.verifyToken,checkSubscription, async (req, res) => {
//     try {
//         const quote = await quoteGenerate.find()


//         res.status(200).json({

//             Loads: quote
//         })
//     } catch (error) {
//         res.status(401).send(error)
//     }
// });


//Loads in mkyloads tab for specific user number

router.post('/refferedBy',jwtAuth.verifyToken,checkSubscription, (req, res, next) => {
    userSignup.findOne({ referalCode: req.body.referalCode }).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc) {
                res.status(200).json({
                    Loads:doc.length,
                    ref:doc.referalCode,
                    _id:doc._id,
                    data: doc,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(400).json({
                    message: "no matching loads found",
                    status: "no docs"
                })

            }
        }
    ).catch(err => {
        res.status(400).json({
            message: "failed to get loads",
            status: "failed",
            error: err
        })
    })
})


//Add truck market vehicle to existing vehcile to existing Load and send notification to vehicle
router.post('/refereduserdata',jwtAuth.verifyToken,checkSubscription, (req, res, next) => {
    var query = { _id: req.body._id };

    //data needed for truck Market vehicle
    const referToData = {

        userName:req.body.firstName + req.body.lastName,
        mobileNo:req.body.mobileNo,
    
    }

    var referData = { $push: { refferedTo: referToData } }
    //get the load information query, get load by the ID and add the Vehicle to array. 
    userSignup.findOneAndUpdate(query, referData).select().exec().then(doc => {
        console.log(doc)
        
        res.status(200).json({
            message: doc
        })
    })



})



router.post('/addAccDetails',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{

    //     console.log(new Date().getTime());
      var query= {_id:req.body._id}  //Transporter userSignup Id
   const body ={
    accountNum:req.body.accountNum,
     ifscCode:req.body.ifscCode,
     accHolderName:req.body.accHolderName,
     upiId:req.body.upiId
   }

   var data=   { $push: { accDetails: body }}
   
     //if no user found then create new user
     userSignup.findOneAndUpdate(query,data).select().exec().then(
         doc=>{
             console.log(doc)

             if(doc){
                //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
             res.status(200).json({
                 data: doc,
                 message:"Account details added Successfull",
                 status:"success"
             })
           
           
         }else{
             res.status(400).json({
                 message:"no matching docs found",
                 status:"no docs"
             })
 
         }
        

         }
     ).catch(err=>{
         res.status(400).json({
             message:"failed to Add account details",
             status: "failed",
             error:err
         })
     })
    
    

    });

//add gst details

router.post('/gstDetails',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{

    //     console.log(new Date().getTime());
      var query= {_id:req.body._id}  //Transporter userSignup Id


   var data=   { $push: { gstDetails: req.body.gstDetails}}
   
     //if no user found then create new user
     userSignup.findOneAndUpdate(query,data).select().exec().then(
         doc=>{
             console.log(doc)

             if(doc){
                //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
             res.status(200).json({
                 data: doc,
                 message:"gst details added Successfull",
                 status:"success"
             })
           
           
         }else{
             res.status(400).json({
                 message:"no matching docs found",
                 status:"no docs"
             })
 
         }
        

         }
     ).catch(err=>{
         res.status(400).json({
             message:"failed to Add gst details",
             status: "failed",
             error:err
         })
     })
    
    

    });
  
 
        
    router.post('/addcoinstoRefered',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{

        //     console.log(new Date().getTime());
          var query= {referalCode:req.body.referalCode}  //Transporter userSignup Id
    
       userSignup.find(query).select().exec().then(
        doc=>{
            console.log(doc)
            for(let i=0;i<doc.length;i++){
                var coins =doc[i].TotalCoins
            }
    
            console.log(coins)
            const body ={
                TotalCoins:coins + 100,
                PermanetCoins: coins + 100
            
               }
         //if no user found then create new user
         userSignup.findOneAndUpdate(query,body).select().exec().then(
             doc=>{
                 console.log(doc)
    
                 if(doc){
                    //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                 res.status(200).json({
                     data: doc,
                     message:"Account details added Successfull",
                     status:"success"
                 })
               
               
             }else{
                 res.status(400).json({
                     message:"no matching docs found",
                     status:"no docs"
                 })
     
             }}

         ).catch(err=>{
             res.status(400).json({
                 message:"failed to Add account details",
                 status: "failed",
                 error:err
             })
         })
        
        })
    
        });

        
        router.post('/withdrawCoins',jwtAuth.verifyToken,checkSubscription, (req, res, next)=>{

            //     console.log(new Date().getTime());
              var query= {_id:req.body._id}  //Transporter userSignup Id
        
           userSignup.find(query).select().exec().then(
            doc=>{
                console.log(doc)
                for(let i=0;i<doc.length;i++){
                    var coins =doc[i].TotalCoins
                }
        
                console.log(coins)
                const body ={
                    TotalCoins:coins - Number(req.body.withdrawCoins),
                
                   }
             //if no user found then create new user
             userSignup.findOneAndUpdate(query,body).select().exec().then(
                 doc=>{
                     console.log(doc)
        
                     if(doc){
                        //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                     res.status(200).json({
                         data: doc,
                         message:"Coins Updated Success",
                         status:"success"
                     })
                   
                   
                 }else{
                     res.status(400).json({
                         message:"no matching docs found",
                         status:"no docs"
                     })
         
                 }}
    
             ).catch(err=>{
                 res.status(400).json({
                     message:"failed to update coins",
                     status: "failed",
                     error:err
                 })
             })
            
            })
        
            });


module.exports = router;