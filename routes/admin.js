//first import the express
const express = require("express");
//define the router
const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

const nodemailer = require('nodemailer')
const sdk = require('api')('@onesignal/v9.0#1g2uuailbwvyjvk')
const OneSignal = require('@onesignal/node-onesignal')

const pointsWithdraw = require('../models/pointswithdraw');
const quoteGenerate = require('../models/generateQuotemodal');
const vehicle = require("../models/vehicle");
const userSignup = require("../models/userSignup");
const adminData = require("../models/adminModel");
const contact = require("../models/menuContactUs")
const adminMessage = require("../models/adminMessage");
const { restart } = require("nodemon");


//Admin signup

router.post('/signupAdmin', (req, res, next) => {
    console.log("User ")
    const adminSignup = new adminData({
        _id: new mongoose.Types.ObjectId,

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,

    });


    var mobileNo = req.body.mobileNo;
    //first check if user is alredy existed 
    adminData.findOne({ mobileNo: mobileNo }).select().exec().then(doc => {
        console.log(doc)
        if (doc == null) { //if no user found then create new user
            adminSignup.save().then(result => {
                // sendnotificationforplacebid(req.body.firstName + req.body.lastName,"You Registered As",req.body.role,req.body.uniqueDeviceId)
                res.status(200).json({
                    message: "Admin signed up susccessfully",
                    status: "success",
                    Id: result._id,
                    selectType: result.role
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed"
                });
            })

        } else {
            res.status(500).json({
                message: "user aleredy exists",
                status: "failed"

            })
        }


    });


});

//Admin Login


router.post('/loginAdmin', async (req, res) => {
    adminData.find({ email: req.body.email, password: req.body.password }).select().exec().then(
        doc => {

            if (doc.length) {
                console.log(doc)
                res.status(200).json({
                    data: doc
                })
            } else {
                res.status(201).json({
                    message: "No Matching data found",
                    status: "failed",

                })

            }
        }
    ).catch(err => {
        res.status.json({

            error: err
        })
    })
});

//get all users for admin dashboard

router.get('/allUsers', async (req, res) => {
    try {
        const users = await userSignup.find({})

        res.status(200).json({
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

//get all type of loads for admin dashboard

router.get('/allPostedLoads', async (req, res) => {
    try {
        const loads = await quoteGenerate.find({})

        res.status(200).json({
            TotalLoads: loads.length,
            loads
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});


//get Queries data

router.get('/allQueries', async (req, res) => {
    try {
        const queries = await contact.find({})

        res.status(200).json({
            TotalQueries: queries.length,
            queries
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

router.get('/allNotifications', async (req, res) => {
    try {
        const notifications = await adminMessage.find({})

        res.status(200).json({
            TotalNotifications: notifications.length,
            notifications
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});


router.get('/searchByLetterForQueries/:key', async (req, res) => {
    const data = await contact.find(
        {
            "$or": [

                { Name: { $regex: new RegExp("^" + req.params.key, "i") } },
                { PhoneNumber: { $regex: new RegExp("^" + req.params.key, "i") } },
                { Query: { $regex: new RegExp("^" + req.params.key, "i") } },
                { Loadid: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
    res.status(200).json({
        data
    })
});

//Users filter for admin

router.get('/usersFilter/:gstVerify', async (req, res) => {
    try {
        const users = await userSignup.find({ gstVerify: req.params.gstVerify })
        if (!users) {
            res.status(404).send({ error: "Users not found" })
        }
        res.status(200).json({
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
});

//Get loads by status for admin

router.get('/loadsByStatusForAdmin/:isActive', async (req, res) => {
    try {
        const load = await quoteGenerate.find({ isActive: req.params.isActive })
        if (!load) {
            res.status(404).send({ error: "Loads not found" })
        }
        res.status(200).json({
            TotalLoads: load.length,
            load
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
});


//all vehiclesfor admin  panel

router.get('/allVehiclesForAdmin', async (req, res) => {
    try {
        const vehicles = await vehicle.find()

        res.status(200).json({
            TotalVehicles: vehicles.length,
            vehicles
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

// Search function


// router.get('searchUsers/:key', async (req, res) => {
//     console.log("saan")
//         const result = await userSignup.find({
//             '$or': [
//                 { mobileNo: { $regex: "^" + req.params.key } },
//                 { companyName: { $regex: "^" + req.params.key } },
//                 { role: { $regex: "^" + req.params.key } },
//                 { firstName: { $regex: "^" + req.params.key } },
//                 { lastName: { $regex: "^" + req.params.key } },
//                 { city: { $regex: "^" + req.params.key } },

//             ]
//         })

//         try {
//             res.status(201).json({
//                 item: result
//             })
//         } catch (err) {
//             res.status(401).json(err)
//             console.log(err)
//         }
//     })


router.get('/searchByLetterForUsers/:key', async (req, res) => {
    const data = await userSignup.find(
        {
            "$or": [
                // { mobileNo: { $regex:  req.params.key  } },
                { companyName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { role: { $regex: new RegExp("^" + req.params.key, "i") } },
                { firstName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { lastName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { city: { $regex: new RegExp("^" + req.params.key, "i") } },
                { referalCode: { $regex: new RegExp("^" + req.params.key, "i") } },
            ]
        }
    )
    res.status(200).json({
        data
    })
})


router.get('/searchByLetterForVehicles/:key', async (req, res) => {
    const data = await vehicle.find(
        {
            "$or": [

                { trukvehiclenumber: { $regex: new RegExp("^" + req.params.key, "i") } },
                { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { trukname: { $regex: new RegExp("^" + req.params.key, "i") } },
                { trukOwnerNumber: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
    res.status(200).json({
        data
    })
});



router.get('/searchByLetterForActiveLoads/:key', async (req, res) => {
    const data = await quoteGenerate.find(
        {
            "$or": [

                { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { DestinationLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { LoadId: { $regex: new RegExp("^" + req.params.key, "i") } },
                { Number: { $regex: new RegExp("^" + req.params.key, "i") } },
                { expectedPrice: { $regex: new RegExp("^" + req.params.key, "i") } },
                { isActive: { $regex: new RegExp("^" + req.params.key, "i") } },
                { UserName: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
    //     try{    const data = loads.filter(data => {
    //             return data.isActive == "Active"
    //         })
    //         if (data.length) {

    //             res.status(200).json({
    //                 data,
    //                 message: "got the matching loads",
    //                 status: "success"
    //             })
    //         } else {
    //             res.status(200).json({
    //                 data,
    //                 message: "no matching loads found",
    //                 status: "success"
    //             })

    //         } }catch (error) {
    //             res.status(401).json({ error })
    //             console.log(error)
    //         }
    //     }
    // )
    res.status(200).json({
        data
    })
});


router.get('/searchByLetterForCompletedLoads/:key', async (req, res) => {
    const loads = await quoteGenerate.find(
        {
            "$or": [

                { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { DestinationLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { LoadId: { $regex: new RegExp("^" + req.params.key, "i") } },
                { Number: { $regex: new RegExp("^" + req.params.key, "i") } },
                { expectedPrice: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
    try {
        const data = loads.filter(data => {
            return data.isActive == "Completed"
        })
        if (data.length) {

            res.status(200).json({
                data,
                message: "got the matching loads",
                status: "success"
            })
        } else {
            res.status(200).json({
                data,
                message: "no matching loads found",
                status: "success"
            })

        }
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
}
)


//update Query status

router.put('/query/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['queryStatus'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await contact.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(200).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

//Filter for cont and role of users

router.get('/usersFilterForShipper/:role', async (req, res) => {
    try {
        const users = await userSignup.find({ role: { $regex: new RegExp("^" + req.params.role) } })
        if (!users) {
            res.status(404).send({ error: "Users not found" })
        }
        res.status(200).json({
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
});

// router.get('/usersPendingWithDraw/:withdrawStatus', async (req, res) => {
//     try {
//         const users = await userSignup.find({ withdrawStatus: { $regex: new RegExp("^" + req.params.withdrawStatus) } })
//         if (!users) {
//             res.status(404).send({ error: "Users not found" })
//         }
//         res.status(200).json({
//             TotalUsers: users.length,
//             users
//         })
//     } catch (error) {
//         res.status(401).json({ error })
//         console.log(error)
//     }
// });

router.get('/usersPendingWithDraw/:withdrawStatus', async (req, res) => {
    try {
      const withdrawStatus = req.params.withdrawStatus;
      const users = await userSignup.find({ withdrawStatus: { $in: ["Pending", "Completed"] } });
  
      if (!users) {
        return res.status(404).send({ error: "Users not found" });
      }
  
      res.status(200).json({
        TotalUsers: users.length,
        users
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


//update Query status

router.put('/userWithdrawStatus/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['withdrawStatus'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await userSignup.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(200).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/getuser', async (req, res) => {  //// async makes a function return a Promise
    try {
        const user = await adminData.find({})
        //await makes a function wait for a Promise
        res.status(200).json({ user })
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

router.delete('/delete/:id', (req, res) => {
    adminData.findByIdAndDelete(req.params.id)  //params means parameter value
        .then(() => res.json('user deleted'))
        .catch(err => res.status(400).json(`Error: ${err}`));

})

router.put('/update/:id', (req, res) => {
    adminData.findByIdAndUpdate(req.params.id, req.body)  //params means parameter value
        .then(() => res.json('user updated'))
        .catch(err => res.status(400).json(`Error: ${err}`));

})


// oneSignal 

router.post('/sendMessages', async (req, res, next) => {

    const externalId = req.body.externalId

    const messageData = new adminMessage({
        title: req.body.title,
        description: req.body.description,
        to:req.body.to
    })
    //8fda6cf4-bdbe-4f2e-a709-24f8990ad307
    const ONESIGNAL_APP_ID = '8fda6cf4-bdbe-4f2e-a709-24f8990ad307';

    const app_key_provider = {
        getToken() {
            //return 'ZjA4ZTMyOGEtOTEzMy00MzQyLTg2MmItYWM3YTExMTM2YzI2';
            return 'OWE5OTk1MTctMjM1NC00ZTZiLWFhNTgtMmY2MTlkNTY0NWZm'
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
    // notification.included_segments = ['Subscribed Users'];
    notification.include_external_user_ids = externalId
    console.log(messageData)
    notification.headings = {
        en: messageData.title
    }
    notification.contents = {
        en: messageData.description
    };
    const { id } = await client.createNotification(notification);

    const response = await client.getNotification(ONESIGNAL_APP_ID, id);

    console.log(response)
    const data = await messageData.save()
    try {
        return res.status(201).json({
            message: "Notification sent successfully",
            messsageDetails: data,
            response
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error sending the message"
        })
    }


})




module.exports = router;