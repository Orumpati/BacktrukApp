const express = require('express'); 
//this is one of the router so we need to get the router module
const router = express.Router();
var mongoose =require('mongoose');
const registerModel= require('../models/userSignup');
const bodyParser = require('body-parser');
const jwtAuth = require('../jwtAuth');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



// router.post('/loginDetails',async(req,res,next)=>{
//     var mobileNo = req.body.mobileNo ;
    
//     console.log(mobileNo)
//      registerModel.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{
//      console.log("Response",doc.mobileNo)  
         
//          var em = req.body.mobileNo;

//          const mobileNo = doc.mobileNo;
//          const token = jwtAuth.generateToken(mobileNo);
//          const refreshToken = jwtAuth.generateRefreshToken(mobileNo);
     

//          if(em == doc.mobileNo){
            
//              res.status(200).json({Authentication :doc._id,
//                          message:"success",
//                          status:"success",
//                          mobileNo:doc.mobileNo,
//                          firstName:doc.firstName,
//                          lastName:doc.lastName,
//                          role:doc.role,
//                          city:doc.city,
//                          companyName:doc.companyName,
//                          aadharVerify:doc.aadharVerify,
//                          gstVerify:doc.gstVerify,
//                          uniqueDeviceId:doc.uniqueDeviceId,
//                          data:doc,
//                          userRole:doc.userRole,
//                          Availability:doc.Availability,
//                          DriverName:doc.DriverName,
//                          TrukCapacity:doc.TrukCapacity,
//                          TrukNumber:doc.TrukNumber,
//                          TrukType:doc.TrukType,
//                          referalCode:doc.referalCode,
//                          referTo:doc.refferedTo,
//                          signupReferalCode:doc.signupReferalCod,
//                          token,
//                          refreshToken ,
//                          subscriptionType:doc.subscriptionType,
//                          subscriptionStartDate:doc.subscriptionStartDate,
//                          subscriptionEndDate:doc.subscriptionEndDate,
//                          payment_history:doc.payment_history,
//                          SignupDate:doc.SignupDate

//                     })   
//                 }else{
//              res.status(400).json({Authentication:"failed to Read Mobile NO",
//                     message:"failed",
//                     status:"failed",     
//             });
//          }
//      }).catch(err =>{
//          console.log(err);
//          res.status(500).json({error :err,
//             status:"failed"
//         });
//      });
//      });


router.post('/loginDetails', async (req, res, next) => {
    const mobileNo = req.body.mobileNo;

    try {
        const doc = await registerModel.findOne({ mobileNo: mobileNo }).exec();
        if (!doc) {
            return res.status(400).json({
                Authentication: "failed to Read Mobile NO",
                message: "failed",
                status: "failed"
            });
        }

        // Update uniqueDeviceId
        const newUniqueDeviceId = req.body.uniqueDeviceId;
        doc.uniqueDeviceId = newUniqueDeviceId;
        await doc.save();
        console.log(newUniqueDeviceId)

        // Generate tokens
        const token = jwtAuth.generateToken(mobileNo);
        const refreshToken = jwtAuth.generateRefreshToken(mobileNo);

        // Prepare response
        const response = {
            Authentication: doc._id,
            message: "success",
            status: "success",
            mobileNo: doc.mobileNo,
            firstName: doc.firstName,
            lastName: doc.lastName,
            role: doc.role,
            city: doc.city,
            companyName: doc.companyName,
            aadharVerify: doc.aadharVerify,
            gstVerify: doc.gstVerify,
            uniqueDeviceId: doc.uniqueDeviceId, // Updated uniqueDeviceId
            data: doc,
            userRole: doc.userRole,
            Availability: doc.Availability,
            DriverName: doc.DriverName,
            TrukCapacity: doc.TrukCapacity,
            TrukNumber: doc.TrukNumber,
            TrukType: doc.TrukType,
            referalCode: doc.referalCode,
            referTo: doc.refferedTo,
            signupReferalCode: doc.signupReferalCod,
            token,
            refreshToken,
            subscriptionType: doc.subscriptionType,
            subscriptionStartDate: doc.subscriptionStartDate,
            subscriptionEndDate: doc.subscriptionEndDate,
            payment_history: doc.payment_history,
            SignupDate: doc.SignupDate
        };
            
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error,
            status: "failed"
        });
    }
});


     router.post('/refresh-token', (req, res) => {
        const refreshTokenValue = req.body.refreshToken;
        jwtAuth.refreshToken(req, res, (err, newAccessToken) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden"});
            }
            res.status(200).json({ accessToken: newAccessToken });
        });
    });


    router.post('/logout',async(req,res,next)=>{

        var mobileNo = req.body.mobileNo ;
         registerModel.findOne({mobileNo:mobileNo}).select().exec().then( doc =>{
         console.log("Response",doc.mobileNo)  
             
             var em = req.body.mobileNo;
             const mobileNo = doc.mobileNo;
             const tokenHeader = req.headers.authorization;

        if (tokenHeader) {
            const token = tokenHeader.split(' ')[1];
            jwtAuth.addToBlacklist(token);
        }
             if(em == doc.mobileNo){
                 res.status(200).json({
                            Authentication :doc._id,
                             message:"Loggedout successfully",
                             status:"success",
                             mobileNo:doc.mobileNo,                     
                        })   
                    }else{
                 res.status(400).json({
                        message:"Failed to Logout",
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