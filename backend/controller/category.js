const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Category = require("../model/category");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");

// Kategori oluşturma
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

// Tüm kategorileri getir
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

// Belirli bir kategoriyi getir
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



// Kategori düzenleme
router.put(
    "/update-category/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const categoryId = req.params.id;
        const updatedData = req.body;
        const images = updatedData.images;
  
        // Kategori kimliği ile mevcut kategoriyi bulun
        const existingCategory = await Category.findById(categoryId);
  
        if (!existingCategory) {
          return next(new ErrorHandler("Category not found", 404));
        }
  
        // Güncellenmiş verileri kullanarak kategoriyi güncelleyin
        existingCategory.name = updatedData.name;
        existingCategory.description = updatedData.description;
  
        // Yalnızca resimler güncellenmişse yeni resim URL'lerini dahil edin
        if (images && images.length > 0) {
          // Cloudinary'den mevcut resimleri silin
          for (let i = 0; i < existingCategory.images.length; i++) {
            await cloudinary.v2.uploader.destroy(existingCategory.images[i].public_id);
          }
  
          // Yeni resimleri yükleyin
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
  
          // Yeni resim URL'lerini kategoriye ekleyin
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
  
  

// Kategori silme
router.delete(
    "/delete-category/:id",
    async (req, res, next) => {
      try {
        const categoryId = req.params.id;
  
        // Kategori kimliği ile mevcut kategoriyi veya ürünü bulun
        const category = await Category.findById(categoryId);
  
        if (!category) {
          return next(new ErrorHandler("Category not found", 404));
        }
  
        // Kategori veya ürünün resimlerini alın
        const imagesToDelete = category.images.map((image) => image.public_id);
  
        // Cloudinary'den resimleri silin
        for (let i = 0; i < imagesToDelete.length; i++) {
          await cloudinary.v2.uploader.destroy(imagesToDelete[i]);
        }
  
        // Kategoriyi veya ürünü silin
        await category.remove();
  
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
