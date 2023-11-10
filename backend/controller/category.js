const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Category = require("../model/category");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");

router.post(
  "/create-category",
  catchAsyncErrors(async (req, res, next) => {
    try {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
        console.log(req.body.images)
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "categories",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const categoryData = req.body; 
        categoryData.images = imagesLinks;

        if (req.body.supercategory) {

          const supercategory = await Category.findById(req.body.supercategory);
  
          if (supercategory) {

            categoryData.parentCategory = supercategory._id

            supercategory.subcategories.push(categoryData);
            await supercategory.save();
          }
        }

      const category = await Category.create(req.body);
      res.status(201).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(error, "error")
      return next(new ErrorHandler(error.message, 400));
    }
  }
));

router.get(
  "/get-all-categories",
  async (req, res, next) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }
);

router.get(
  "/get-category/:id",
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }
);



router.put(
    "/update-category/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const categoryId = req.params.id;
        const updatedData = req.body;
        const images = updatedData.images;
  
        const existingCategory = await Category.findById(categoryId);
  
        if (!existingCategory) {
          return next(new ErrorHandler("Category not found", 404));
        }
  
        existingCategory.name = updatedData.name;
        existingCategory.description = updatedData.description;
  
        if (images && images.length > 0) {
          for (let i = 0; i < existingCategory.images.length; i++) {
            await cloudinary.v2.uploader.destroy(existingCategory.images[i].public_id);
          }
  
          const imagesLinks = [];
  
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
              folder: "categories",
            });
  
            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
  
          existingCategory.images = imagesLinks;
        }
  
        await existingCategory.save();
  
        res.status(200).json({
          success: true,
          message: "Category updated successfully!",
          category: existingCategory,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  
  router.put(
    "/add-subcategories/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const categoryId = req.params.id;
        const newSubCategories = Array.isArray(req.body) ? req.body : [req.body];
        const superCategory = await Category.findById(categoryId);
  
        if (!superCategory) {
          return next(new ErrorHandler("Category not found", 404));
        }
  
        if (!Array.isArray(superCategory.subcategories) || superCategory.subcategories.length === 0) {
          superCategory.subcategories = newSubCategories;
          console.log("ife girdi");
        } else {
          // Eğer alt kategori daha önce eklenmişse, güncelle veya ekle
          newSubCategories.forEach((newSubCategory) => {
            const index = superCategory.subcategories.findIndex((sub) => sub.name === newSubCategory.name);
            if (index >= 0) {
              // Eğer alt kategori zaten varsa, güncelle
              superCategory.subcategories[index] = newSubCategory;
            } else {
              // Eğer alt kategori yoksa, ekle
              superCategory.subcategories.push(newSubCategory);
            }
          });
          console.log("elseye girdi");
        }
  
        // Eski alt kategorileri temizle
        superCategory.subcategories = superCategory.subcategories.filter(
          (sub, index, self) =>
            index === self.findIndex((s) => s._id === sub._id)
        );
  
        await superCategory.save();
  
        res.status(200).json({
          success: true,
          message: "Subcategories added or updated successfully!",
          category: superCategory,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
  

router.delete(
    "/delete-category/:id",
    async (req, res, next) => {
      try {
        const categoryId = req.params.id;
  
        const category = await Category.findById(categoryId);
  
        if (!category) {
          return next(new ErrorHandler("Category not found", 404));
        }
  
        const imagesToDelete = category.images.map((image) => image.public_id);
  
        for (let i = 0; i < imagesToDelete.length; i++) {
          await cloudinary.v2.uploader.destroy(imagesToDelete[i]);
        }
  
        await category.deleteOne({ _id: categoryId });

  
        res.status(200).json({
          success: true,
          message: "Category deleted successfully!",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    }
  );
  

module.exports = router;
