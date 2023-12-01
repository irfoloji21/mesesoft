const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

//isSeller eklenecek
router.post(
  "/create-coupon-code",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCouponCodeExists = await CoupounCode.find({
        name: req.body.name,
      });

      if (isCouponCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupon code already exists!", 400));
      }

      const newCouponCode = await CoupounCode.create(req.body);

      
      const users = await User.find();

      for (const user of users) {
      console.log(user)
        const couponToAdd = {
          couponID: newCouponCode._id,
          quantity: newCouponCode.customer,
        }; 

        

        // Kullanıcı kupon eklemesi
        user.coupons = user.coupons.concat(couponToAdd);
        await user.save();
      }

      res.status(201).json({
        success: true,
        couponCode: newCouponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);



//isSeller eklenecek
router.get(
  "/get-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//get coupon by id
router.get(
  "/get-coupon-code/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findById(req.params.id);
      res.status(201).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//isSeller eklenecek
router.delete(
  "/delete-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.post(
  "/use-coupon-code",
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      const couponCode = await CoupounCode.findOne({
        name: req.body.couponName,
      });

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code not found!", 404));
      }


      const user = await User.findById(req.body.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found!", 404));
      }

      for (const userCoupon of user.coupons) {
        if (userCoupon.couponID.toString() === couponCode._id.toString()) {
          if (userCoupon.quantity > 0) {
            userCoupon.quantity--; 
          } else {
            return next(new ErrorHandler("User has no remaining uses of this coupon!", 400));
          }
          break; 
        }
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Coupon code used successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


module.exports = router;
