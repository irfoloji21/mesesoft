const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Blog = require("../model/blog");
const User = require("../model/user");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// fakepath olduğu için resim betal edilmiştir.
//fakepath olayı çoklu resim olan birçok yerde var.
router.post(
  "/create-blog",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        // let images = [];
        
        // if (typeof req.body.images === "string") {
        //   images.push(req.body.images);
        // } else {
        //   images = req.body.images;
        // }
        
        // const imagesLinks = [];
        
        // for (let i = 0; i < images.length; i++) {
        //   console.log(images[i])
        //   const result = await cloudinary.v2.uploader.upload(images[i], {
        //     folder: "blog",
        //   });
          
        //   imagesLinks.push({
        //     public_id: result.public_id,
        //     url: result.secure_url,
        //   });
        // }
        
        

           
        const blogData = req.body;
        // blogData.images = imagesLinks;
        blogData.shop = shop;

        console.log(blogData)
        const blog = await Blog.create(blogData);

        res.status(201).json({
          success: true,
          blog,
        });
      
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

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
  
  // isAuthenticated eklenecek
  router.put(
    "/create-new-review",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { user, comment, blogId, reviewTitle, email, name } = req.body;
  
        const blog = await Blog.findById(blogId);
  
        if (!blog) {
          return next(new Error("Belirtilen blogId ile eşleşen blog bulunamadı.", 404));
        }
  
        const review = {
          user,
          comment,
          blogId,
          reviewTitle,
          email,
          name
        };
  
        blog.reviews.push(review);
  
        await blog.save({ validateBeforeSave: false });
  
        res.status(200).json({
          success: true,
          message: "Review added successfully!",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  
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


  router.put(
    '/like-blog/:id',
    catchAsyncErrors(async (req, res, next) => {
      const blogId = req.params.id;
      const userId = req.body.user._id; 
      console.log(blogId, userId)
  
      try {
        const blog = await Blog.findById(blogId);
  
        if (!blog) {
          return next(new Error('Belirtilen blogId ile eşleşen blog bulunamadı.', 404));
        }
  
        const user = await User.findById(userId);
  
        if (user.likedBlogs.includes(blogId)) {
          return next(new Error('Bu blog zaten beğenilmiş.', 400));
        }
  
        blog.likes += 1;
  
        user.likedBlogs.push(blogId);
  
        await blog.save({ validateBeforeSave: false });
        await user.save();
  
        res.status(200).json({
          success: true,
          message: 'Blog liked successfully!',
          likes: blog.likes,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  
  router.put(
    '/unlike-blog/:id',
    catchAsyncErrors(async (req, res, next) => {
      const blogId = req.params.id;
      const userId = req.body.user._id; 
  
      try {
        const blog = await Blog.findById(blogId);
  
        if (!blog) {
          return next(new Error('Belirtilen blogId ile eşleşen blog bulunamadı.', 404));
        }
  
        const user = await User.findById(userId);
  
        if (!user.likedBlogs.includes(blogId)) {
          return next(new Error('Bu blog beğenilmemiş, bu yüzden geri alınamaz.', 400));
        }
  
        blog.likes -= 1;
  
        const index = user.likedBlogs.indexOf(blogId);
        if (index > -1) {
          user.likedBlogs.splice(index, 1);
        }
  
        await blog.save({ validateBeforeSave: false });
        await user.save();
  
        res.status(200).json({
          success: true,
          message: 'Blog unliked successfully!',
          likes: blog.likes,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  
  
  module.exports = router;