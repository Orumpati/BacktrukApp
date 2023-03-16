const express = require('express'); 
//this is one of the router so we need to get the router module
const router = express.Router();
var mongoose =require('mongoose');
//const mobilePlaceOrder = require('../models/notification');
const bodyParser = require('body-parser');


const sdk = require('api')('@onesignal/v9.0#1g2uuailbwvyjvk')
const OneSignal=require('@onesignal/node-onesignal')
//const messaging = firebase.messaging()
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
//creating a post request user registe

router.post('/send', async (req, res, next)=>{

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
    notification.include_external_user_ids=["b989a282-6db7-4d57-b23c-ed09bd9e6442"];
    notification.contents = {
        en: "Hello OneSignal!"
    };
    const {id} = await client.createNotification(notification);
    
    const response = await client.getNotification(ONESIGNAL_APP_ID, id);
    console.log(response)
    res.json(response)

})

//This is the one which is being used now. 
var d = new Date();
var n = d.getTime();



module.exports = router;