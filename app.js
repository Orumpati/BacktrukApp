const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//import * as OneSignal from '@onesignal/node-onesignal';
const OneSignal=require('@onesignal/node-onesignal')
//import all routes here 
const userSignupRoutes = require('./routes/userSignupRoute');
const generateQuote = require('./routes/generateQuote')
const login= require('./routes/loginroute')
const profile =require('./routes/profile')
const vehicle =require('./routes/vehicleroute')
const home = require('./routes/homeroute')
const notification =require('./routes/notificationroute')
const points = require('./routes/pointswithdrawroutes')
const contact =require('./routes/menuContactUs')


//connect to mongodb
       //const uri ='mongodb+srv://trukapp:truk@cluster0.guldekj.mongodb.net/?retryWrites=true&w=majority'
 const uri='mongodb+srv://Orumpati_1234:9705821087Sai@cluster0.uqgd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);
 mongoose.connect(uri)
.then(response =>{
   console.log('mongodb is connected')
   const add ='hd,ejhc,jhe,'
   console.log(add.split(',')[1])
})
.catch(error=>{
   console.log(error)
   console.log("error db is not connected")
});



  

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//enabling cross origin issue
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization' );

if(req.method === 'OPTIONS'){

    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});

}
 next();

});





//truck app used routes 
app.use('/TruckAppUsers', userSignupRoutes); 
app.use('/quotes',generateQuote);
app.use('/login',login);
app.use('/profile',profile)
app.use('/addTruk',vehicle);
app.use('/truckinfo',home)
app.use('/notificationss',notification)
app.use('/contact',contact)
app.use('/point',points);
app.get("/", (req, res, next)=>{
    res.json({
        name:"hello",
        message:"i am working"
    })
})




//to handle error 
app.use((req, res, next) => {

    const error = new Error('Not Found');
    error.status = 400;
    next(error); 

});


//error when nothing is responding
app.use((error, req, res, next) =>{
     
     res.status(error.status || 500);
     res.json({
         error:{
             message: error.message
         }

     });
})








module.exports = app;


//first define the schema 
//second define the routes 
//put these routes in the app.js