// const express = require('express'); 
// //this is one of the router so we need to get the router module
// const router = express.Router();
// var mongoose =require('mongoose');
// //const mobilePlaceOrder = require('../models/notification');
// const bodyParser = require('body-parser');


// const sdk = require('api')('@onesignal/v9.0#1g2uuailbwvyjvk')
// const OneSignal=require('@onesignal/node-onesignal')
// //const messaging = firebase.messaging()
// router.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// router.use(bodyParser.json());
// //creating a post request user registe

// router.post('/send', async (req, res, next)=>{
// //8fda6cf4-bdbe-4f2e-a709-24f8990ad307
//         const ONESIGNAL_APP_ID = '8fda6cf4-bdbe-4f2e-a709-24f8990ad307';
    
//     const app_key_provider = {
//         getToken() {
//             //return 'ZjA4ZTMyOGEtOTEzMy00MzQyLTg2MmItYWM3YTExMTM2YzI2';
//             return 'OWE5OTk1MTctMjM1NC00ZTZiLWFhNTgtMmY2MTlkNTY0NWZm'
//         }
//     };
    
//     const configuration = OneSignal.createConfiguration({
//         authMethods: {
//             app_key: {
//                 tokenProvider: app_key_provider
//             }
//         }
//     });
//     const client = new OneSignal.DefaultApi(configuration);
    
//     const notification = new OneSignal.Notification();
//     notification.app_id = ONESIGNAL_APP_ID;
//     //notification.included_segments = ['Subscribed Users'];
//    // notification.include_external_user_ids=["b1a196d9-6836-4321-a337-5d9b5eb3da72"];
//     notification.contents = {
//         en: "Hello OneSignal!"
//     };
//     const {id} = await client.createNotification(notification);
    
//     const response = await client.getNotification(ONESIGNAL_APP_ID, id);
//     console.log(response)
//     res.json(response)

// })

// //This is the one which is being used now. 
// var d = new Date();
// var n = d.getTime();



// module.exports = router;

const express = require("express");
const notification = express.Router();
require('dotenv').config();

const OneSignal = require('@onesignal/node-onesignal');
const logger = require('../logger');

async function sendnotification(mess,Name,externalids){
    logger.info(externalids)
        const ONESIGNAL_APP_ID = '8fda6cf4-bdbe-4f2e-a709-24f8990ad307';
    
    const app_key_provider = {
        getToken() {
            return 'OWE5OTk1MTctMjM1NC00ZTZiLWFhNTgtMmY2MTlkNTY0NWZm';
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
    logger.info('notification response',id)
    logger.info('notification message',response )
    //res.json(response)
    
    }

async function sendnotificationSubscription(mess,externalids){
        logger.info(externalids)
            const ONESIGNAL_APP_ID = '8fda6cf4-bdbe-4f2e-a709-24f8990ad307';
        
        const app_key_provider = {
            getToken() {
                return 'OWE5OTk1MTctMjM1NC00ZTZiLWFhNTgtMmY2MTlkNTY0NWZm';
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
            en:mess,
        };
        const {id} = await client.createNotification(notification);
        
        const response = await client.getNotification(ONESIGNAL_APP_ID, id);
        logger.info('notification response',id)
        logger.info('notification message',response )
        //res.json(response)
        
        }

module.exports = {sendnotification, sendnotificationSubscription};

