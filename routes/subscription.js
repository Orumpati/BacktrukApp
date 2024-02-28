const moment = require('moment');

const checkSubscription = (req, res, next) => {
    try {
        // const signupDateString = req.query.SignupDate; // Extract SignupDate from query parameters
        // const subscriptionType = req.query.subscriptionType; // Extract subscriptionType from query parameters
        // const subscriptionStartDateString = req.query.subscriptionStartDate; // Extract subscriptionStartDate from query parameters
        // const subscriptionEndDateString = req.query.subscriptionEndDate; // Extract subscriptionEndDate from query parameters

        const { signupDateString, subscriptionType, subscriptionStartDateString, subscriptionEndDateString } = req.body;

        if (!signupDateString) {
            return res.status(400).json({ message: "SignupDate is required in the query parameters." });
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
                        return res.status(403).json({ message: "Subscription expired. Please renew your subscription to continue." });
                    }
                } else {
                    return res.status(400).json({ message: "Invalid subscription dates provided." });
                }
            } else {
                // User's free trial period has expired and no valid subscription details provided
                return res.status(403).json({ message: "Free trial expired. Please subscribe to continue." });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = checkSubscription;
