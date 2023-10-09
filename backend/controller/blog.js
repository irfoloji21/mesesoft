const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Blog = require("../model/blog");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create blog
router.post(
  "/create-blog",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "blog",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        

           
        const blogData = req.body;
        blogData.images = imagesLinks;
        blogData.shop = shop;

        const blog = await Blog.create(blogData);

        res.status(201).json({
          success: true,
          blog,
        });
      
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all blogs of a shop
router.get(
    "/get-all-blogs-shop/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const blogs = await Blog.find({ shopId: req.params.id });
  
        res.status(201).json({
          success: true,
          blogs,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  // delete blog of a shop
  router.delete(
    "/delete-shop-blog/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const blog = await Blog.findById(req.params.id);
  
        if (!blog) {
          return next(new ErrorHandler("Blog is not found with this id", 404));
        }    
  
        for (let i = 0; 1 < blog.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(
            blog.images[i].public_id
          );
        }
      
        await blog.remove();
  
        res.status(201).json({
          success: true,
          message: "Blog Deleted successfully!",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  // get all blogs
  router.get(
    "/get-all-blogs",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
  
        res.status(201).json({
          success: true,
          blogs,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  // review for a blog
  router.put(
    "/create-new-review",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { user, rating, comment, blogId } = req.body;
  
        const blog = await Blog.findById(blogId);
  
        const review = {
          user,
          rating,
          comment,
          blogId,
        };
  
        const isReviewed = blog.reviews.find(
          (rev) => rev.user._id === req.user._id
        );
  
        if (isReviewed) {
            blog.reviews.forEach((rev) => {
            if (rev.user._id === req.user._id) {
              (rev.rating = rating), (rev.comment = comment), (rev.user = user);
            }
          });
        } else {
            blog.reviews.push(review);
        }
  
        let avg = 0;
  
        blog.reviews.forEach((rev) => {
          avg += rev.rating;
        });
  
        blog.ratings = avg / blog.reviews.length;
  
        await blog.save({ validateBeforeSave: false });
  
       
        res.status(200).json({
          success: true,
          message: "Reviwed succesfully!",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  // all blogs --- for admin
  router.get(
    "/admin-all-blogs",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const blogs = await Blog.find().sort({
          createdAt: -1,
        });
        res.status(201).json({
          success: true,
          blogs,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
  // get blog by slug
  router.get("/:slug", async (req, res) => {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug });
      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  module.exports = router;