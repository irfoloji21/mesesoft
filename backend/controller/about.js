const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const About = require("../model/about");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const cloudinary = require("cloudinary");


router.post(
  "/create-about",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {

        // FAKEPATH HATASI!!!
        // let images = [];

        
        // if (typeof req.body.images === "string") {
        //   images.push(req.body.images);
        // } else {
        //   images = req.body.images;
        // }

        
        // const imagesLinks = [];
      // console.log(req.body.images)
     
      // for (let i = 0; i < images.length; i++) {
      //   const result = await cloudinary.v2.uploader.upload(images[i], {
      //     folder: "abouts",
      //   }); 
    
      //   imagesLinks.push({
      //     public_id: result.public_id,
      //     url: result.secure_url,
      //   });
      // }

      

        const aboutData = req.body;
        // aboutData.images = imagesLinks;
        aboutData.shop = shop;

        const about = await About.create(aboutData);

        res.status(201).json({
          success: true,
          about,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.get(
  "/get-all-abouts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const abouts = await About.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        abouts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


module.exports = router;
