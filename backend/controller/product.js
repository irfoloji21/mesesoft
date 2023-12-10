const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

router.post(
  "/create-product",
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
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.delete(
  "/delete-shop-product/:id",
  // isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      const imagesToDelete = product.images.map((image) => image.public_id);

      for (let i = 0; i < imagesToDelete.length; i++) {
        await cloudinary.v2.uploader.destroy(imagesToDelete[i]);
      }

      await product.deleteOne({ _id: req.params.id });

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        user,
        rating,
        comment,
        productId,
        orderId,
        reviewTitle,
        email,
        name,
      } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
        reviewTitle,
        email,
        name,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/get-products-by-category/:id", async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.id });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/search/:keyword", async (req, res) => {
  const searchTerm = req.params.keyword;

  const products = await Product.find({
    $or: [
      // büyük küçük harf ayırt etmeksizin search yapar
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  });

  res.json(products);
});

router.get("/get-product-by-id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.put(
  "/update-product/:productId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const updatedProductData = req.body;

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      existingProduct.name = updatedProductData.name;
      existingProduct.description = updatedProductData.description;
      existingProduct.originalPrice = updatedProductData.originalPrice;
      existingProduct.discountPrice = updatedProductData.discountPrice;
      existingProduct.category = updatedProductData.category;
      existingProduct.slug = updatedProductData.slug;
      existingProduct.tags = updatedProductData.tags;
      existingProduct.stock = updatedProductData.stock;
      existingProduct.gender = updatedProductData.gender;

      //   if (typeof updatedProductData.images === "object") {
      //     updatedProductData.images = JSON.stringify(updatedProductData.images);

      //   if (updatedProductData.images && updatedProductData.images.length > 0) {
      //     const updatedImagesLinks = [];

      //     console.log(typeof updatedProductData.images, "updatedProductData.images")

      //     for (let i = 0; i < updatedProductData.images.length; i++) {
      //       const result = await cloudinary.v2.uploader.upload(updatedProductData.images[i], {
      //         folder: "products",
      //       });

      //       updatedImagesLinks.push({
      //         public_id: result.public_id,
      //         url: result.secure_url,
      //       });
      //     }

      //     existingProduct.images = updatedImagesLinks;
      //   }
      // }

      console.log(typeof existingProduct);

      await existingProduct.save();

      res.status(200).json({
        success: true,
        product: existingProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
