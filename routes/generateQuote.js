
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
//express validator
const OneSignal=require('@onesignal/node-onesignal')
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
//import the schema here
const quoteGenerate = require('../models/generateQuotemodal');

const UserSignup = require("../models/userSignup");
const vehiclemodal = require("../models/vehicle")
//post method goes here
router.post('/generateQuote', (req, res, next) => {
    console.log("generate quotes api is called")


    //find the agents avaibale in the given locations
    UserSignup.find({ routes: { $all: [req.body.pickupState, req.body.dropupState]} }).select().exec().then(doc => {
        console.log(doc.length)

        if (doc.length) { //if no provider available then throw error
            //get the list of peeple here loop throuh each doc and get the 
            var provider = []; //provider be an empty array first
           var externalids =[];
            for (item of doc) {
                //console.log(item.mobileNo);
                provider.push(item.mobileNo)
                externalids.push(item.uniqueDeviceId)
                console.log(item.uniqueDeviceId)
                console.log(provider)
            }
//console.log(externalids)
            //insert empty array of bids
            var bids;



             //use this when posting from truck market tab
        const truckMarketVehicleData={
            trukvehiclenumber:req.body.trukvehiclenumber,
            trukcurrentLocation:req.body.trukcurrentLocation,
            trukoperatingRoutes:req.body.trukoperatingRoutes,
            trukcapacity:req.body.trukcapacity,
            trukname:req.body.trukname,
            trukOwnerNumber:req.body.trukOwnerNumber
          }

            //get the details for the quote generating
            const quote = new quoteGenerate({
                _id: new mongoose.Types.ObjectId,
                OriginLocation: req.body.OriginLocation,
                Number: req.body.Number,
                DestinationLocation: req.body.DestinationLocation,
                dropupState:req.body.dropupState,
                product: req.body.product,
                Quantity: req.body.Quantity,
                pickupState: req.body.pickupState,
                data: req.body.data,
                isTrukOpenOrClose:req.body.isTrukOpenOrClose,
                typeOfHyva:req.body.typeOfHyva,
                typeOfTrailer:req.body.typeOfTrailer,
                typeOfContainer:req.body.typeOfContainer,
                typeofTanker:req.body.typeofTanker,
                expectedPrice: req.body.expectedPrice,
                date: req.body.date,
                typeOfPay: req.body.typeOfPay,
                paymentTypeForOffline:req.body.paymentTypeForOffline,
                advance:req.body.advance,
                length: req.body.length,
                breadth: req.body.breadth,
                height: req.body.height,
                comments: req.body.comments,
                quoteStatus: req.body.quoteStatus,
                quoteSentTo: provider,
                bids: bids,
                TruckMarketVehicle: truckMarketVehicleData,
                LoadId:req.body.LoadId
            });

            quote.save().then(result => {
                console.log(result);
           
                sendnotification(req.body.mess,req.body.LoadPosterName,externalids)
                //send mobile notification to every user in the array with their quote ID in notification
                res.status(200).json(
                   
                    {
                    
                    message: "quote generate and sent succeesfully",
                    status: "success",
                    Id: result._id
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed",
                    message: "failed to generateQuote"
                });
            })

        } else { //when no provider available
            res.status(400).json({
                status: "failed",
                message: "no providers available"
            })
        }

    })


});


//all Loads

router.get('/allQuotes', async (req, res) => {
    try {
        const quote = await quoteGenerate.find()


        res.status(200).json({

            Loads: quote
        })
    } catch (error) {
        res.status(401).send(error)
    }
});


//Loads in mkyloads tab for specific user number

router.post('/myLoadsForSpecificNumber', (req, res, next) => {
    quoteGenerate.find({ Number: req.body.Number }).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc.length) {
                res.status(200).json({
                    Loads:doc.length,
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


//Loads for Specific truck
router.post('/LoadsForSpecificTruck', (req, res, next) => {
    
    quoteGenerate.find({"TruckMarketVehicle.trukvehiclenumber":req.body.trukvehiclenumber}).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc.length) {
                res.status(200).json({
                    Loads:doc.length,
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

//contact us get loads by usernumber and active and completed status oloasd


router.post('/contactusStatusAndNumber', async (req, res) => {
    const quote = await quoteGenerate.find()
  
    var filter= quote.filter(data=>{
     return data.Number==req.body.Number
    })
    
   // console.log(filter)
    
    try {
      //  const load = await array.find({ isActive: req.params.isActive })
      var load = filter.filter(data=>{
        return data.isActive == req.body.isActive
      })
      console.log(load)
        if (!load) {
            res.status(400).send({ error: "Loads not found" })
        }
        res.status(200).json({
            TotalLoads: load.length,
            load
        })
    } catch (error) {
        res.status(400).json({ error })
        console.log(error)
    }
})
//get by id

router.get('/quoteById/:id', async (req, res) => {
    try {
        const quote = await quoteGenerate.find({ _id: req.params.id })
        console.log(quote)
        if (!quote) {
            res.status(404).send({ error: " not found" })
        }
        res.status(200).json(quote)
    } catch (error) {
        res.status(401).json(error)
    }
})

//update Load

router.put('/updateQuotes/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['OriginLocation', 'DestinationLocation', 'Number', 'product', 'Quantity', 'expectedPrice','dropupState','pickupState',
        'date', 'typeOfPay', 'comments', 'data'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await quoteGenerate.findOne({ _id: req.params.id }) //finding the products based on id
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


//update NegoSghiy
router.put('/updateNego/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['TohideNegoshit'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await quoteGenerate.findOne({ _id: req.params.id }) //finding the products based on id
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
//Isactive to Deactive Funtion


router.put('/quoteDeactivate/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['isActive'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await quoteGenerate.findOne({ _id: req.params.id }) //finding the products based on id
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
});


//Get the load by isActive

router.get('/loadsByStatus/:isActive', async (req, res) => {
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
})




//LoadMarket APIS where trukers and agents get to see the loads based on their profile. 
router.post('/LoadMarket', (req, res, next) => {
    quoteGenerate.find({quoteSentTo: { $all: [req.body.mobileNo] } }).select().exec().then(
        doc => {
           
            var load = doc.filter(data=>{
                return data.isActive == req.body.isActive
              })
              console.log(load)
            //check if it has matching docs then send response
            if (load) {
                res.status(200).json({
                    item: load,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    message: "no matching loads found",
                    status: "failed"
                })

            }
        }
    ).catch(err => {
        res.status.json({
            message: "failed to get loads",
            status: "failed",
            error: err
        })
    })
})


router.post('/placeBid', (req, res, next)=>{


   
    //alternate bid Current Bid Service
    const placeIniBid ={
     _id: new mongoose.Types.ObjectId,
     mobileNo:req.body.mobileNo,
     BidActivity: [{"price":req.body.Bidprice,
                 "userNo": req.body.mobileNo,
             
                 "userType":req.body.userType,  //this only for trucker side for the first time.
                 "time": new Date().getTime()}],
     tentativefinalPrice: req.body.Bidprice,  //first time placed bid by trucker
     TohideAcceptBtn:req.body.TohideAcceptBtn,
     agentInitialBidSend:req.body.agentInitialBidSend,
     initialAccept:req.body.initialAccept,
     isAgentAccepted:req.body.isAgentAccepted,
     time: new Date().getTime()
 }
 
       //form the query here
       var query=   { $push: { bids: placeIniBid }}
 
       UserSignup.find({mobileNo:Number(req.body.Number)}).select().exec().then(
        doc=>{
         var   loadpostedNumber =  doc
        
      console.log(loadpostedNumber)
      for(let i=0;i<loadpostedNumber.length;i++){
        var uniqId =loadpostedNumber[i].uniqueDeviceId
      }
     
      console.log(uniqId)
     //find the docID or quote ID
     quoteGenerate.findByIdAndUpdate({_id: req.body._id}, query).select().exec().then(
         doc=>{
             console.log(doc)
             //check if it has matching docs then send response
             if(doc){
                sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.Bidprice,uniqId)
             res.status(200).json({
                 data: doc,
                 message:"got the matching loads based on the profile",
                 status:"success"
             })
             //sendnotificationforplacebid(req.body.Bidprice,uniqId,req.body.Name)
            
         }else{
             res.status(400).json({
                 message:"no matching docs found",
                 status:"no docs"
             })
 
         }
         }
     ).catch(err=>{
         res.status(400).json({
             message:"failed to bid",
             status: "failed",
             error:err
         })
     })
    })
 } )
 
 
 //Get the load by status and mobile number

router.post('/loadsByStatusAndNumber', async (req, res) => {
    const quote = await quoteGenerate.find()
  
    var filter= quote.filter(data=>{
     return data.Number==req.body.Number
    })
    
   // console.log(filter)
    
    try {
      //  const load = await array.find({ isActive: req.params.isActive })
      var load = filter.filter(data=>{
        return data.isActive == req.body.isActive
      })
      console.log(load)
        if (!load) {
            res.status(400).send({ error: "Loads not found" })
        }
        res.status(200).json({
            TotalLoads: load.length,
            load
        })
    } catch (error) {
        res.status(400).json({ error })
        console.log(error)
    }
})
 
 
     

//Update Bids by the trukers and Customers
router.post('/updateBids', (req, res, next)=>{

    
        //     console.log(new Date().getTime());
          var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}  //quote id and truker mobile no  always Agent mobile NO
       
    
           //newUpdate query for bids
           var DataToBids={$push:{ "bids.$.BidActivity":{
                         "price":req.body.price,
                          "userNo": req.body.userNo, 
                          "userType":req.body.userType, 
                          "time": new Date().getTime()}
                        },
                          $set:{"bids.$.tentativefinalPrice":req.body.price,"bids.$.TohideAcceptBtn":req.body.TohideAcceptBtn,"multi": true },
                
                        }
  
           console.log(DataToBids)
           console.log(query)
          // { $push: { "bids.$.Bidprice":req.body.price }}

          UserSignup.find({mobileNo:Number(req.body.Number)}).select().exec().then(
            doc=>{
             var   loadpostedNumber =  doc
            
          console.log(loadpostedNumber)
          for(let i=0;i<loadpostedNumber.length;i++){
            var uniqId =loadpostedNumber[i].uniqueDeviceId
          }
         
          console.log(uniqId)
        
         //find the docID or quote ID
         quoteGenerate.findOneAndUpdate(query,DataToBids).select().exec().then(
             doc=>{
                 console.log(doc)
                 //check if it has matching docs then send response
                 if(doc){
                
                 res.status(200).json({
                     data: doc,
                     message:"got the matching loads based on the profile",
                     status:"success"
                 })
                 sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
               
             }else{
                 res.status(400).json({
                     message:"no matching docs found",
                     status:"no docs"
                 })
     
             }

             }
         ).catch(err=>{
             res.status(400).json({
                 message:"failed to bid",
                 status: "failed",
                 error:err
             })
         })
        }) 
     } )
     

//dfghju
//Update Bids by the trukers and Customers
router.post('/findloadbydrivers', (req, res, next)=>{
        //     console.log(new Date().getTime());
          var query= {"vehicleInformation.DriverNumber":req.body.mobileNo,"DriverStatus":req.body.DriverStatus}  //quote id and truker mobile no  always Agent mobile NO

         quoteGenerate.find(query).select().exec().then(
             doc=>{
                 console.log(doc)
                 //check if it has matching docs then send response
                 if(doc){
                    //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                 res.status(200).json({
                     data: doc,
                     message:"got the matching loads based on the profile",
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
     
     


//payment confirm
router.post('/paymentconfirm', (req, res, next)=>{

        //     console.log(new Date().getTime());
          var query= {"_id":req.body._id}  //quote id and truker mobile no  always Agent mobile NO
 
        
         //find the docID or quote ID
         quoteGenerate.findOneAndUpdate(query,{paymentId:req.body.paymentId,isPaymentCompleted:req.body.isPaymentCompleted}).select().exec().then(
             doc=>{
                 console.log(doc)
                 //check if it has matching docs then send response
                 if(doc){
                    //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
                 res.status(200).json({
                     data: doc,
                     message:"got the matching loads based on the profile",
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
                 message:"failed to bid",
                 status: "failed",
                 error:err
             })
         })
       // }) 
     } )
     

//ShowBids to customer
router.post('/showCustomerBids', (req, res, next) => {
    quoteGenerate.find({ "userNumber": req.body.mobileNo }).select().exec().then(doc => {
        res.status(200).json({
            status: "success",
            message: "found the bids",
            bids: doc,
            count: doc.length
        })
    })
})


//show agent side bids and this should restrict to only his bids not other bids
router.post('/showAgentBids', (req, res, next) => {
    quoteGenerate.find({ "bids.mobileNo": req.body.mobileNo }).select().exec().then(doc => {
        console.log(doc);

        //accessing particular bids of that user truker only bids accessed here 
        var bidData = [];
        if (doc) {
            var tempData;
            for (item of doc) {
                for (i of item.bids) {
                    if (i.mobileNo == req.body.mobileNo) {
                        console.log(i.mobileNo);
                        var obj = {
                            id: item._id,
                            OriginLocation: req.body.OriginLocation,
                            Number: req.body.Number,
                            DestinationLocation: req.body.DestinationLocation,
                            product: req.body.product,
                            Quantity: req.body.Quantity,
                            state: req.body.state,
                            data: req.body.data,
                            expectedPrice: req.body.expectedPrice,
                            date: req.body.date,
                            typeOfPay: req.body.typeOfPay,
                            length: req.body.length,
                            breadth: req.body.breadth,
                            height: req.body.height,
                            comments: req.body.comments,
                            quoteStatus: item.quoteStatus,
                            quoteBid: i
                        }
                        bidData.push(obj);
                    }

                }
            }



            //console.log(tempData);
            res.status(200).json({
                status: "success",
                message: "found the bids",
                bids: bidData,
                count: doc.length
            })
        } else {
            res.status(400).json({
                status: "failed",
                message: "no bids found"
            })
        }



    })
})

///Show agent side bids for particular QUOTE ID and particular Agent Mobile NO
router.post('/showAgentSideBidConversation', (req, res, next)=>{
    console.log(req.body._id)
    console.log(req.body.mobileNo)
    quoteGenerate.find({"bids.mobileNo":req.body.mobileNo, "_id":req.body._id}).select().exec().then(doc=>{
         console.log(doc);

        //accessing particular bids of that user truker only bids accessed here 
        var bidData=[];
        if(doc){
            var tempData;
           for(item of doc){
            //for(j of item.vehicleInformation){
            for(i of item.bids){
              
                if(i.mobileNo==req.body.mobileNo){
                    console.log(i.mobileNo);
                    var obj={
                        id:item._id,
                        OriginLocation:item.OriginLocation,
                        Number:item.Number,
                        DestinationLocation:item.DestinationLocation,
                        product:item.product,
                        Quantity:item.Quantity,
                        state:item.state,
                        data:item.data,
                        expectedPrice:item.expectedPrice,
                        date:item.date,
                        typeOfPay:item.typeOfPay,
                        length:item.length,
                        breadth:item.breadth,
                        height:item.height,
                        initialAccept:item.initialAccept,
                        comments:item.comments,
                        quoteStatus:item.quoteStatus,
                        shareContact:item.shareContact,
                        TohideNegoshit:item.TohideNegoshit,
                        paymentId:item.paymentId,
                        isPaymentCompleted:item.isPaymentCompleted,
                        quoteBid:i,
                        vehicleInformation:item.vehicleInformation,
                        
                       
                    }
                    bidData.push(obj);
                }
            }
           // }
           }



        //console.log(tempData);
        res.status(200).json({
            status:"success",
            message: "found the bids",
            bids:bidData,
            count:doc.length
        })
    }else{
        res.status(400).json({
            status:"failed",
            message:"no bids found"
        })
    }



    })
})



//Accepting final quote by user
router.post('/acceptQuoteByUser',(req,res,next)=>{

    var query={"_id":req.body._id };
    var update ={$set:{userAcceptedPrice:req.body.acceptedPrice,isActive:"Finalised"}}
    quoteGenerate.findOneAndUpdate(query,update).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})


//initial accept by shipper
router.post('/initialacceptbyshipper',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}
    var update ={$set:{"bids.$.isShipperAccepted":req.body.isShipperAccepted,"bids.$.TohideAcceptBtn":req.body.TohideAcceptBtn,"bids.$.BidStatus":req.body.BidStatus,"multi": true}}
    console.log(update)
    UserSignup.find({mobileNo:Number(req.body.Number)}).select().exec().then(
        doc=>{
         var   loadpostedNumber =  doc
        
      console.log(loadpostedNumber)
      for(let i=0;i<loadpostedNumber.length;i++){
        var uniqId =loadpostedNumber[i].uniqueDeviceId
      }
     
      console.log(uniqId)
    quoteGenerate.findOneAndUpdate(query,update).select().exec().then(
        doc=>{

            console.log(doc)
        
            res.status(200).json({
                message:doc,
                status:"success"
            })
            sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.Bidprice,uniqId)
        } )
    })
})

//final aaccept by agent
router.post('/finalacceptbyagent',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id,"bids.mobileNo":req.body.mobileNo}
    var update ={$set:{"bids.$.isAgentAccepted":req.body.isAgentAccepted,"bids.$.TohideAcceptBtn":req.body.TohideAcceptBtn,"bids.$.BidStatus":req.body.BidStatus ,"multi": true}}
    console.log(update)
    UserSignup.find({mobileNo:Number(req.body.Number)}).select().exec().then(
        doc=>{
         var   loadpostedNumber =  doc
        
      console.log(loadpostedNumber)
      for(let i=0;i<loadpostedNumber.length;i++){
        var uniqId =loadpostedNumber[i].uniqueDeviceId
      }
    quoteGenerate.findOneAndUpdate(query,update).select().exec().then(
        doc=>{
            sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.Bidprice,uniqId)
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
          //  sendnotificationforplacebid(req.body.Bidprice,uniqId,req.body.Name)
            //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.Bidprice,uniqId)
        })

    })
})


//final aaccept by agent
router.post('/getsingleloadbids',(req,res,next)=>{

    //var query={"_id":req.body._id };
    var query= {"_id":req.body._id}
    
    
    quoteGenerate.find(query).select().exec().then(
        doc=>{
            console.log(doc)
            res.status(200).json({
                message:doc,
                status:"success"
            })
        }
    )
})


router.post('/attachVehicleToLoad', (req, res, next)=>{

    //data needed for attaching load
    const vehicleData={
      vehicleNo:req.body.vehicleNo,
      vehicleType:req.body.vehicleType,
      vehicleCurrentLocation:req.body.vehicleCurrentLocation,
      vehicleCapacity:req.body.vehicleCapacity, 
      agentNo:req.body.agentNo,
      BidID:req.body.BidID,
      DriverName:req.body.DriverName,
      DriverNumber:req.body.DriverNumber,
      operatingRoutes:req.body.operatingRoutes,
      date:req.body.date,
      transporterName:req.body.transporterName,
      companyName:req.body.companyName,
      mobileNumber:req.body.mobileNumber,
      city:req.body.city
      
    }

   
    //query find by the IDAddDrivers
   var query={"_id":req.body._id};
    //form the query here
    var updateData=   { $set: {vehicleInformation: vehicleData, isVehicleAttached:true,shareContact:req.body.shareContact }}  //$set for setting the variable value
    console.log(query)
    //find the docID or quote ID
   //  quoteGenerate.findOneAndUpdate(query, updateData).select().exec().then(
       quoteGenerate.findOneAndUpdate(query,updateData).select().exec().then(
        doc=>{
            console.log(doc)
            //check if it has matching docs then send response
            if(doc){
            res.status(200).json({
                data: doc,
                message:"attaching load to the vehicle",
                status:"success"
            })
        }else{
            res.status(400).json({
                message:"no vehicles attached",
                status:"failed"
            })

        }
        }
    ).catch(err=>{
        res.status(400).json({
            message:"failed to attach vehicle",
            status: "failed",
            error:err
        })
    })


})

router.post('/attachPod', (req, res, next)=>{

    //     console.log(new Date().getTime());
      var query= {_id:req.body._id}  //Transporter userSignup Id
   const body ={
    waybill:req.body.waybill,
    orderId:req.body.orderId,
    ConsigneeName:req.body.ConsigneeName,
    Address:req.body.Address,
    Finalstatus:req.body.Finalstatus,
    DeliveredOn:req.body.DeliveredOn
   }

   var data=   { $set: { ProofOfdelivery: body, DriverStatus:req.body.DriverStatus}}
  
   quoteGenerate.findOneAndUpdate(query,data).select().exec().then(
         doc=>{
             console.log(doc)

             if(doc){
                //sendnotificationforplacebid(req.body.mess,req.body.Name,req.body.price,uniqId)
             res.status(200).json({
                 data: doc,
                 message:"POD added Successfull",
                 status:"success"
             })
           
           
         }else{
             res.status(400).json({
                 message:"no matching Loads found",
                 status:"no docs"
             })
 
         }
        

         }
     ).catch(err=>{
         res.status(400).json({
             message:"failed to Add POD",
             status: "failed",
             error:err
         })
     })
    
    

    });
 
//Add truck market vehicle to existing vehcile to existing Load and send notification to vehicle
router.post('/addTruckMarketVehicleToLoad', (req, res, next) => {
    var query = { _id: req.body._id };

    //data needed for truck Market vehicle
    const truckMarketVehicleData = {
  


        trukvehiclenumber:req.body.trukvehiclenumber,
        OriginLocation:req.body.OriginLocation,
        trukoperatingRoutes:req.body.trukoperatingRoutes,
        trukcapacity:req.body.trukcapacity,
        trukname:req.body.trukname,
        trukOwnerNumber:req.body.trukOwnerNumber
    }

    var updateTruckMarketData = { $push: { TruckMarketVehicle: truckMarketVehicleData } }
    //get the load information query, get load by the ID and add the Vehicle to array. 
    quoteGenerate.findOneAndUpdate(query, updateTruckMarketData).select().exec().then(doc => {
        console.log(doc)
        
        res.status(200).json({
            message: doc
        })
    })



})
//attach load to vehicle in vehicle.js
router.post('/addloadtotruck', (req, res, next) => {




    var query = { _id: req.body._id };

    const placeIniBid ={
        _id: new mongoose.Types.ObjectId,
        loadids:req.body.loadids
    }

    var updateTruckMarketData = { $push: { attachedLoadIds: placeIniBid } }
    //get the load information query, get load by the ID and add the Vehicle to array. 
    vehiclemodal.findOneAndUpdate(query, updateTruckMarketData).select().exec().then(doc => {
        console.log(doc)
        
        res.status(200).json({
            message: doc
        })
    })



})


router.post('/findLoadsinProgress', (req, res, next)=>{
    var query = { Number: req.body.Number};

    const body={
        //shipperAccept:req.body.shipperAccept,
       // "bids.isAgentAccepted":req.body.isAgentAccepted,
        shareContact:req.body.shareContact
    }  

     quoteGenerate.find(query,body).select().exec().then(
         doc=>{
             console.log(doc)
            
             if(doc){
                
             res.status(200).json({
                 data: doc,
                 message:"got the matching loads based on the profile",
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


    //LoadMarket APIS where trukers and agents get to see the loads based on their profile. 
router.post('/transporteinprogress', (req, res, next) => {
    var query = {quoteSentTo: { $all: [req.body.mobileNo] } }
console.log(query)
 

    quoteGenerate.find({quoteSentTo: { $all: [req.body.mobileNo] }}).select().exec().then(
        doc => {
 
            var load = doc.filter(data=>{
                return data.shareContact == req.body.shareContact
              })

            //check if it has matching docs then send response
            if (load) {
                res.status(200).json({
                    item: load,
                    message: "got the matching loads based on the profile",
                    status: "success"
                })
            } else {
                res.status(201).json({
                    message: "no matching loads found",
                    status: "failed"
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
 
//notification function
 async function sendnotification(mess,Name,externalids){
console.log(externalids)
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
notification.include_external_user_ids = externalids;
notification.contents = {
    en:Name+" "+ mess 
};
const {id} = await client.createNotification(notification);

const response = await client.getNotification(ONESIGNAL_APP_ID, id);
console.log(response)
//res.json(response)

}



async function sendnotificationforplacebid(mess,Name,BidPrice,uniqId){
    
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
    notification.include_external_user_ids = [uniqId];
    notification.contents = {
        en:  Name +" "+mess+" "+BidPrice
    };
    const {id} = await client.createNotification(notification);
    
    const response = await client.getNotification(ONESIGNAL_APP_ID, id);
    console.log(response)
    //res.json(response)
    
    }


   
module.exports = router;