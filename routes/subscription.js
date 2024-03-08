// const moment = require('moment');

// const checkSubscription = (req, res, next) => {
//     try {
//         let signupDateString, subscriptionType, subscriptionStartDateString, subscriptionEndDateString;

//         if (req.method === "GET") {
//             signupDateString = req.query.signupDateString;
//             subscriptionType = req.query.subscriptionType;
//             subscriptionStartDateString = req.query.subscriptionStartDateString;
//             subscriptionEndDateString = req.query.subscriptionEndDateString;
//         } else {
//             signupDateString = req.body.signupDateString;
//             subscriptionType = req.body.subscriptionType;
//             subscriptionStartDateString = req.body.subscriptionStartDateString;
//             subscriptionEndDateString = req.body.subscriptionEndDateString;
//         }

//         if (!signupDateString) {
//             return res.status(400).json({ message: "SignupDate is required in the body" });
//         }

//         const currentDate = moment();
//         const signupDate = moment(signupDateString, "D/M/YYYY, h:mm:ss a"); // Parse SignupDate using moment

//         // Check if the user is within the free trial period
//         const daysSinceSignup = currentDate.diff(signupDate, 'days');
//         const subscriptionDuration = 30; // Duration of the free trial period in days

//         if (daysSinceSignup <= subscriptionDuration) {
//             // User is within the free trial period, proceed to check for subscription
//             if (subscriptionType && subscriptionType !== "null" && subscriptionStartDateString && subscriptionStartDateString !=="null" && subscriptionEndDateString && subscriptionEndDateString!=="null") {
//                 const subscriptionStartDate = moment(subscriptionStartDateString, "D/M/YYYY, h:mm:ss a");
//                 const subscriptionEndDate = moment(subscriptionEndDateString, "D/M/YYYY, h:mm:ss a");

//                 if (subscriptionStartDate.isValid() && subscriptionEndDate.isValid()) {
//                     if (currentDate.isBetween(subscriptionStartDate, subscriptionEndDate, null, '[]')) {
//                         // Subscription is active, proceed to the next middleware or API handler
//                         next();
//                     } else {
//                         return res.status(403).json({ message: "Subscription expired. Please renew your subscription to continue." });
//                     }
//                 } else {
//                     return res.status(400).json({ message: "Invalid subscription dates provided." });
//                 }
//             } else {
//                 // User is within free trial but no valid subscription details provided
//                 next();
//             }
//         } else {
//             // User's free trial period has expired, check for subscription
//             if (subscriptionType && subscriptionType !== "null" && subscriptionStartDateString && subscriptionStartDateString !=="null" && subscriptionEndDateString && subscriptionEndDateString!=="null") {
//                 // Parse subscription start and end dates using moment
//                 const subscriptionStartDate = moment(subscriptionStartDateString, "D/M/YYYY, h:mm:ss a");
//                 const subscriptionEndDate = moment(subscriptionEndDateString, "D/M/YYYY, h:mm:ss a");

//                 if (subscriptionStartDate.isValid() && subscriptionEndDate.isValid()) {
//                     if (currentDate.isBetween(subscriptionStartDate, subscriptionEndDate, null, '[]')) {
//                         // Subscription is active, proceed to the next middleware or API handler
//                         next();
//                     } else {
//                         return res.status(403).json({ message: "Subscription expired. Please renew your subscription to continue." });
//                     }
//                 } else {
//                     return res.status(400).json({ message: "Invalid subscription dates provided." });
//                 }
//             } else {
//                 // User's free trial period has expired and no valid subscription details provided
//                 return res.status(403).json({ message: "Free trial expired. Please subscribe to continue." });
//             }
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

const moment = require('moment');
const { sendnotificationSubscription } = require('../routes/notificationroute');

const checkSubscription = async (req, res, next) => {
    try {
        let signupDateString, subscriptionType, subscriptionStartDateString, subscriptionEndDateString, externalids;

        if (req.method === "GET") {
            signupDateString = req.query.signupDateString;
            subscriptionType = req.query.subscriptionType;
            subscriptionStartDateString = req.query.subscriptionStartDateString;
            subscriptionEndDateString = req.query.subscriptionEndDateString;
            externalids = req.query.externalids.split(',');

        } else {
            signupDateString = req.body.signupDateString;
            subscriptionType = req.body.subscriptionType;
            subscriptionStartDateString = req.body.subscriptionStartDateString;
            subscriptionEndDateString = req.body.subscriptionEndDateString;
            externalids = req.body.externalids;
        }

        if (!signupDateString) {
            return res.status(400).json({ message: "SignupDate is required in the body" });
        }

        const currentDate = moment();
        const signupDate = moment(signupDateString, "D/M/YYYY, h:mm:ss a"); // Parse SignupDate using moment

        // Check if the user is within the free trial period
        const daysSinceSignup = currentDate.diff(signupDate, 'days');
        const subscriptionDuration = 30; // Duration of the free trial period in days

        if (daysSinceSignup <= subscriptionDuration) {
            // User is within the free trial period, proceed to check for subscription
            if (subscriptionType && subscriptionType !== "null" && subscriptionStartDateString && subscriptionStartDateString !=="null" && subscriptionEndDateString && subscriptionEndDateString!=="null") {
                const subscriptionStartDate = moment(subscriptionStartDateString, "D/M/YYYY, h:mm:ss a");
                const subscriptionEndDate = moment(subscriptionEndDateString, "D/M/YYYY, h:mm:ss a");

                if (subscriptionStartDate.isValid() && subscriptionEndDate.isValid()) {
                    if (currentDate.isBetween(subscriptionStartDate, subscriptionEndDate, null, '[]')) {
                        // Subscription is active, proceed to the next middleware or API handler
                        next();
                    } else {
                        // Subscription expired
                        await sendnotificationSubscription("Subscription expired. Please renew your subscription to continue.", externalids);
                        return res.status(403).json({ message: "Subscription expired. Please renew your subscription to continue." });
                    }
                } else {
                    return res.status(400).json({ message: "Invalid subscription dates provided." });
                }
            } else {
                // User is within free trial but no valid subscription details provided
                next();
            }
        } else {
            // User's free trial period has expired, check for subscription
            if (subscriptionType && subscriptionType !== "null" && subscriptionStartDateString && subscriptionStartDateString !=="null" && subscriptionEndDateString && subscriptionEndDateString!=="null") {
                // Parse subscription start and end dates using moment
                const subscriptionStartDate = moment(subscriptionStartDateString, "D/M/YYYY, h:mm:ss a");
                const subscriptionEndDate = moment(subscriptionEndDateString, "D/M/YYYY, h:mm:ss a");

                if (subscriptionStartDate.isValid() && subscriptionEndDate.isValid()) {
                    if (currentDate.isBetween(subscriptionStartDate, subscriptionEndDate, null, '[]')) {
                        // Subscription is active, proceed to the next middleware or API handler
                        next();
                    } else {
                        // Subscription expired
                        await sendnotificationSubscription("Subscription expired. Please renew your subscription to continue.", externalids);
                        return res.status(403).json({ message: "Subscription expired. Please renew your subscription to continue." });
                    }
                } else {
                    return res.status(400).json({ message: "Invalid subscription dates provided." });
                }
            } else {
                // User's free trial period has expired and no valid subscription details provided
                await sendnotificationSubscription("Free trial expired. Please subscribe to continue.", externalids);
                return res.status(403).json({ message: "Free trial expired. Please subscribe to continue." });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = checkSubscription;


// module.exports = checkSubscription;
