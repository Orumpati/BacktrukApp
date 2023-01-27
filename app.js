const express = require('express');
const app = express();
//const morgan = require('morgan');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator')
const mongoose = require('mongoose');
const cors = require('cors')
//import all routes here 
const userSignupRoutes = require('./routes/userSignupRoute');
const generateQuote = require('./routes/generateQuote')


//connect to the mongo
/*mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://truckapp:365dDqb@cluster0.j93vm65.mongodb.net/?retryWrites=true&w=majority");
mongoose.Promise = global.Promise;*/

//connect to mongodb
const uri = 'mongodb+srv://Orumpati_1234:9705821087Sai@cluster0.uqgd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);
 mongoose.connect(uri)
.then(response =>{
   console.log('mongodb is connected')
})
.catch(error=>{
   console.log(error)
   console.log("error db is not connected")
});

//provides additional logs in the console
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors())
//app.use(expressValidator());
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


// Routes which should handle routes
// ...rest of the initial code omitted for simplicity.
const { body, validationResult } = require('express-validator');


//truck app used routes 
app.use('/TruckAppUsers', userSignupRoutes); 
app.use('/quotes',generateQuote)
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