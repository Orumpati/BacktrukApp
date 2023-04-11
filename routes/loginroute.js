const express = require('express'); 
//this is one of the router so we need to get the router module
const router = express.Router();
var mongoose =require('mongoose');
const registerModel= require('../models/userSignup');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
//creating a post request user register
router.post('/loginDetails',async(req,res,next)=>{
    var mobileNo = req.body.mobileNo ;
    
    console.log(mobileNo)
     registerModel.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{
        console.log(mobileNo)  
         
         var em = req.body.mobileNo;
     
         
         //const olduser = registerModel.findOne(Email)

         if(em == doc.mobileNo){
            
             res.status(200).json({Authentication :doc._id,
                         message:"success",
                         status:"success",
                         mobileNo:doc.mobileNo,
                         firstName:doc.firstName,
                         lastName:doc.lastName,
                         role:doc.role,
                         city:doc.city,
                         companyName:doc.companyName,
                         aadharVerify:doc.aadharVerify,
                         gstVerify:doc.gstVerify,
                         uniqueDeviceId:doc.uniqueDeviceId,
                         data:doc,
                         userRole:doc.userRole,
                         Availability:doc.Availability,
                         DriverName:doc.DriverName,
                         TrukCapacity:doc.TrukCapacity,
                         TrukNumber:doc.TrukNumber,
                         TrukType:doc.TrukType,
                         referalCode:doc.referalCode,
                         referTo:doc.refferedTo,
                         signupReferalCode:doc.signupReferalCode

                     
                        
                    })
            
         }
    
             else{
             res.status(400).json({Authentication:"failed to Read Mobile NO",
                    message:"failed",
                    status:"failed",
                
                    
            });
          
         }
         
        

     }).catch(err =>{
         console.log(err);
         res.status(500).json({error :err,
            status:"failed"
        });
     });
 
     });
module.exports = router;