const express = require("express");
const router = express.Router();
const Collection = require("../model/collection");
const Shop = require("../model/shop");
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const { isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");

 

router.post(
    "/create-collection",
    catchAsyncErrors(async (req, res, next) => {
        try {
          ///////// FAKEPATH YÜZÜNDEN RESİM YÜKLENMİYOR
        // console.log("1")
        //   let images = [];
        //   console.log("2")

        //   if (typeof req.body.images === "string") {
        //     images.push(req.body.images);
        //   } else {
        //     images = req.body.images;
        //   }
        //   console.log("3")

        //   const imagesLinks = [];
        // console.log(req.body.images)
       
        //     const result = await cloudinary.v2.uploader.upload(images, {
        //       folder: "collections",
        //     });
        //     console.log("5")

        //     imagesLinks.push({
        //       public_id: result.public_id, 
        //       url: result.secure_url,
        //     });
        //     console.log("6")

        
        //   console.log("7")

          
          
          // const { name, saving, description } = req.body;

       


             console.log("8") 

            const shopId = req.body.shopId;
            
            const shop = await Shop.findById(shopId);
            if (!shop) {
              return next(new ErrorHandler("Shop Id is invalid!", 400));
            }  else {

      
                  const collectionData = new Collection( {
                    name: req.body.name,
                    // images: imagesLinks,
                    saving: req.body.saving,
                    description: req.body.description,
                    shopId: shopId,
                    shop: shop,
                  });

                  console.log(collectionData + "data")
      
              const collection = await Collection.createCollection(collectionData);
      
              res.status(201).json({
                success: true,
                collection,
              });
            }
          } catch (error) {
            
            error = JSON.stringify(error);
            return next(new ErrorHandler(error, 400));
          }
    })
  );

  // Çoklu ürün ekleme
  router.post(
    "/add-products/:collectionId",
    async (req, res) => {
      try {
        const { collectionId } = req.params;
        const { productIds } = req.body;
        console.log(productIds + "productIds")
  
        const collection = await Collection.findById(collectionId);
  

        if (!collection) {
          return res.status(404).json({
            success: false,
            message: "Koleksiyon bulunamadı",
          });
        }
  
        for (const productId of productIds) {
          const product = await Product.findById(productId);
          if (product) {
            collection.productIds.push(productId);
          }
        }
            console.log(collection + "irfo");
        const collectionSave = await Collection.save();
        console.log(collectionSave + "loji");
  
        res.status(200).json({
          success: true,
          collectionSave
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
  

// Tüm koleksiyonları getirme
router.get("/collections", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json({
        success: true,
        collections,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Belirli bir koleksiyonu getirme
router.get("/collections/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({
        success: true,
        collection,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//güncelleme 
router.put("/collections/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!collection) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({
        success: true,
        collection,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/collections/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndRemove(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({ message: "Koleksiyon başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
