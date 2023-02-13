const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
var FCM = require('fcm-node')
var firebaseToken = "AAAAtmxKQK4:APA91bHVjwrWQPJq3ZiaRm9-SDWa83XDoz1GH5JBx9Nivcbjpt908fJOpd9FPGY6LQWewTqk7IsNKRTketnzSSlh9xel5MazKqkU1MOGcX_zrfbW5mEJphpNdWQQ9RpoIcmcqWi-w45W"
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

app.get("/", (req, res, next)=>{
    res.json({
        name:"hello",
        message:"i am working"
    })
})


//send notification using firebase
  app.post('/send', (req, res, next)=>{

    try{
let fcm = new FCM(firebaseToken)

const message ={
    to:"/topics/" + req.body.topic,
    notification:{
        title:req.body.title,
        body:req.body.body,
        sound:'default',
        click_action:"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
    },
    data:req.body.data
}
fcm.send(message,(err,response)=>{
    if(err){
        next(err)
    }else{
        res.json(response)
    }
})
    }catch(err){
        next(err);
    }

})

//send notifiation using One signal
app.post('/onesignal', async (req, res, next)=>{

   /* OneSignal.idsAvailable(new OneSignal.idsAvailableHandler(),{
     idsAvailable(userId,registrationId){
        console.log(userId)
        if(registration !=null)
            console.log(registrationId)
        
     }
    })*/
   
    const ONESIGNAL_APP_ID = '913bcc8c-f580-44fb-94e5-1e5f97a80546';
    
    const app_key_provider = {
        getToken() {
            return 'ZTk0Y2I0NmEtMTVmZC00MDJjLTljYjYtOTNjYWYyZTBjODlh';
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
    notification.included_segments = ['Subscribed Users'];
    notification.contents = {
        en: "Hello OneSignal!"
    };
    const {id} = await client.createNotification(notification);
    
    const response = await client.getNotification(ONESIGNAL_APP_ID, id);
    console.log(response)
    res.json(response)
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