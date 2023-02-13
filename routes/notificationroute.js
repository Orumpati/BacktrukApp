const express = require('express'); 
//this is one of the router so we need to get the router module
const router = express.Router();
var mongoose =require('mongoose');
//const mobilePlaceOrder = require('../models/notification');
const bodyParser = require('body-parser');
var FCM = require('fcm-node')

//const messaging = firebase.messaging()
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
//creating a post request user register

var admin = require("firebase-admin");

//var serviceAccount = require("../routes/rahuls-7d881-firebase-adminsdk-jqq1d-2d0e3faf8f.json");

/*var firebaseToken = "AAAAtmxKQK4:APA91bHVjwrWQPJq3ZiaRm9-SDWa83XDoz1GH5JBx9Nivcbjpt908fJOpd9FPGY6LQWewTqk7IsNKRTketnzSSlh9xel5MazKqkU1MOGcX_zrfbW5mEJphpNdWQQ9RpoIcmcqWi-w45W"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rahuls-7d881.firebaseio.com"
});*/




router.post('/send', (req, res, next)=>{

    try{
        messaging.getToken().then(token =>{
            if(token){
                console.log(token)
            }else{
                console.log('eror')
            }
        })

    }catch(err){
        next(err);
    }

})

//This is the one which is being used now. 
var d = new Date();
var n = d.getTime();

//Post Request starts here 
router.post('/', (req, res, next)=>{
    console.log('mobile place order called');
          //implementing the schema
          const mobileOrder =new mobilePlaceOrder({
       
                _id: new mongoose.Types.ObjectId(),
                lat:req.body.lat,
                Long:req.body.long,
                Username:req.body.Username,
                MobileNo:req.body.MobileNo,
                location:req.body.address,
                TotalAmount: req.body.totalamount,
                OrderItems: req.body.order,
                OrderStatus: req.body.OrderStatus,
                OrderDate: req.body.OrderDate,
                OrderId:n,
                useNId:req.body.token
                     });
              mobileOrder.save()
              .then(result =>{
                        
                          res.status(200).json({
                          
                              message: 'created order successfully',
                              status:'success',
                              order_id: result.OrderId,
                              docId:result._id
                          
                           });

                 // notifyclientsforplaceorder();   

               }).catch(err=>{
                    res.status(500)
                       .json({
                        error :err
                        });
                   })



});

//get all the Mobile Place Orders
router.get('/getAllOrders', (req, res, next)=>{
    
    mobilePlaceOrder.find({OrderStatus: {$ne: "Delivered"}}).exec()
         .then(docs =>{
             res.status(200).json({
              count: docs.length,
              orders: docs.map(doc =>{
                       return{
                           _id: doc._id,
                          OrderStatus:doc.OrderStatus,
                          OrderDate: doc.OrderDate,
                          TotalAmount: doc.TotalAmount,
                          OrderData: doc,
                    
                       }
               

              })


             });
         })
         .catch(err => {
             res.status(500).json({
                error: err
             });
         });
   


     
      
});




//Get orders by the customer name
router.get('/getAllOrders/:UserName', (req, res, next)=>{
  const UserName = req.params.UserName;
  mobilePlaceOrder.find({Username:UserName}).exec()
       .then(docs =>{
           res.status(200).json({
            count: docs.length,
            orders: docs.map(doc =>{
                     return{
                         _id: doc._id,
                        OrderStatus:doc.OrderStatus,
                        OrderDate: doc.OrderDate,
                        TotalAmount: doc.TotalAmount,
                        OrderData: doc,
                  
                     }
             

            })


           });
       })
       .catch(err => {
           res.status(500).json({
              error: err
           });
       });
 


   
    
});


module.exports = router;