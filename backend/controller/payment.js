const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const amount = req.body.amount; 
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Invalid amount");
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: amount, 
        currency: "usd",
        metadata: {
          company: "MeseSoft",
        },
      });

      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error) {
      console.error("Stripe API error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred with our connection to Stripe.",
      });
    }
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);


module.exports = router;