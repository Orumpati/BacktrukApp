const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();
const User = require('../models/userSignup');
const { sendnotificationSubscription } = require('../routes/notificationroute');

// function to calculate the date and type of subscription
function calculateEndDateAndType(amount) {
  const currentDate = new Date();
  let endDate = new Date(currentDate);
  let subscriptionType = '';

  if (amount === 99900) { // 999 * 100
    // For 99900 amount, set the end date to 365 days from the current date
    endDate.setDate(currentDate.getDate() + 365);
    subscriptionType = 'yearly';
  } else if (amount === 9900) { // 99 * 100
    // For 9900 amount, set the end date to 30 days from the current date
    endDate.setDate(currentDate.getDate() + 30);
    subscriptionType = 'monthly';
  }

  // Format the date as "dd/mm/yyyy hh:mm:ss"
  const formattedEndDate = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return { endDate: formattedEndDate, subscriptionType };
}

//payment execution endpoint
router.post("/payment/:userId", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = req.body;

    const externalids =req.body;
    

    await sendnotificationSubscription("Payment successfull", externalids);

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    // Calculate end date and subscription type based on the amount
    const { endDate, subscriptionType } = calculateEndDateAndType(order.amount);

    // Update the user schema with subscriptionStartDate, subscriptionEndDate, and subscriptionType
    // Assuming you have the user ID available in req.query.userId
    const user = await User.findByIdAndUpdate(req.params.userId, {
      subscriptionStartDate: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      subscriptionEndDate: endDate,
      subscriptionType: subscriptionType,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Add the end date, subscription type, and subscription start date to the order object
    order.subscriptionEndDate = endDate;
    order.subscriptionType = subscriptionType;

    // Decode and set subscriptionStartDate
    const createdDate = new Date(order.created_at * 1000);
    order.subscriptionStartDate = createdDate.toLocaleString('en-GB');

    
    // Add subscription details to the response object
    order.subscriptionStartDate = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    order.subscriptionEndDate = endDate;
    order.subscriptionType = subscriptionType;

    res.json(order );
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

router.post("/validate", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, externalids } = req.body;
     console.log(req.body)

    const razorpaySecret = process.env.KEY_SECRET;

    if (!razorpaySecret) {
      return res.status(500).json({ error: "RAZORPAY_SECRET environment variable is not defined." });
    }

    const sha = crypto.createHmac("sha256", razorpaySecret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    console.log("Updating user's payment history...");

    // Update the user's payment history array
    const user = await User.findByIdAndUpdate(userId, {
      $push: { payment_history: { orderId: razorpay_order_id, paymentId: razorpay_payment_id } }
    });

    console.log("User updated:", user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    await sendnotificationSubscription("Payment successfull", externalids);

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      user:user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//payment validation endpoint
// router.post("/validate", async (req, res) => {
// 	try {
// 	  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
// 	  const razorpaySecret = process.env.KEY_SECRET;
  
// 	  if (!razorpaySecret) {
// 		return res.status(500).json({ error: "RAZORPAY_SECRET environment variable is not defined." });
// 	  }
  
// 	  const sha = crypto.createHmac("sha256", razorpaySecret);
// 	  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
// 	  const digest = sha.digest("hex");
  
// 	  if (digest !== razorpay_signature) {
// 		return res.status(400).json({ msg: "Transaction is not legit!" });
// 	  }
  
// 	  res.json({
// 		msg: "success",
// 		orderId: razorpay_order_id,
// 		paymentId: razorpay_payment_id,
// 	  });
// 	} catch (err) {
// 	  console.error(err);
// 	  res.status(500).json({ error: "Internal Server Error" });
// 	}
//   });

module.exports = router;

