const express = require('express'); 
//this is one of the router so we need to get the router module
const router = express.Router();
var mongoose =require('mongoose');
const homeModel= require('../models/home');
const jwtAuth = require('../jwtAuth');




router.post('/home',jwtAuth.verifyToken, async(req, res, next) => {        // want to create product details
   const homeModels = new homeModel({
      _id: new mongoose.Types.ObjectId,
      AdsArray: req.body.AdsArray,
      TruksInfo: req.body.TruksInfo,
      

   });
   try {
       await homeModels.save()
       

       res.status(201).json({
           homedetails: homeModels
       })
       
   } catch (error) {
       console.log(error)
       res.status(401).json(error)
   }

})

router.get('/gethome',jwtAuth.verifyToken, async (req, res) => {
   try {
       const Load = await homeModel.find()


       res.status(200).json({
           TotalProducts: Load.length,
          data: Load
       })
   } catch (error) {
       res.status(401).send(error)
   }
});
module.exports = router;