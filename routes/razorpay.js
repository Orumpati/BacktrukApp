const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();

// Function to calculate end date based on the amount
function calculateEndDate(amount) {
  // Convert amount to paise
  amount = parseInt(amount) * 100;

  const currentDate = new Date();
  let endDate = new Date(currentDate);

  if (amount === 99900) { // 999 * 100
    // For 999 amount, set the end date to 365 days from the current date
    endDate.setDate(currentDate.getDate() + 365);
  } else if (amount === 10000) { // 99 * 100
    // For 99 amount, set the end date to 30 days from the current date
    endDate.setDate(currentDate.getDate() + 30);
  }

  // Format the date as "dd/mm/yyyy hh:mm:ss"
  const formattedEndDate = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return formattedEndDate;
}

// Updated API endpoint to calculate end date based on the amount
// router.post("/order", async (req, res) => {
//   try {
//     const razorpay = new Razorpay({
//       key_id: process.env.KEY_ID,
//       key_secret: process.env.KEY_SECRET,
//     });

//     const options = req.body;
//     const order = await razorpay.orders.create(options);

//     if (!order) {
//       return res.status(500).send("Error");
//     }

//     // Calculate end date based on the amount
//     const end_date = calculateEndDate(order.amount);

//     // Add the end date to the order object
//     order.end_date = end_date;

//     // Convert Unix timestamp to formatted date (dd/mm/yyyy hh:mm:ss)
//     const createdDateTime = new Date(order.created_at * 1000).toLocaleString('en-GB');

//     // Add the converted date to the order object
//     order.created_at_formatted = createdDateTime;

//     res.json(order);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// });
//22
router.post("/payment", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = req.body;

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    // Calculate end date based on the amount
    const end_date = calculateEndDate(order.amount);

    // Add the end date to the order object
    order.end_date = end_date;

    // Convert Unix timestamp to formatted date (dd/mm/yyyy hh:mm:ss)
    const createdDateTime = new Date(order.created_at * 1000).toLocaleString('en-GB');

    // Add the converted date to the order object
    order.created_at_formatted = createdDateTime;

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});


router.post("/validate", async (req, res) => {
	try {
	  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
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
  
	  res.json({
		msg: "success",
		orderId: razorpay_order_id,
		paymentId: razorpay_payment_id,
	  });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  });
  

module.exports = router;

