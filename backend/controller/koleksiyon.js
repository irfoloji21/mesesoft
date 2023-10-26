const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Koleksiyon = require("../model/koleksiyon");
const Shop = require("../model/shop");
const Product = require("../model/product");
const cloudinary = require("cloudinary");
const { isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");


 

router.post(
    "/create-koleksiyon",
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
        //       folder: "koleksiyons",
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

      
                  const koleksiyonData = new Koleksiyon( {
                    name: req.body.name,
                    // images: imagesLinks,
                    saving: req.body.saving,
                    description: req.body.description,
                    shopId: shopId,
                    shop: shop,
                  });

                  console.log(koleksiyonData + "data")
      
              const koleksiyon = await Koleksiyon.createCollection(koleksiyonData);
      
              res.status(201).json({
                success: true,
                koleksiyon,
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
    "/add-products/:koleksiyonId",
    async (req, res) => {
      try {
        const { koleksiyonId } = req.params;
        const { productIds } = req.body;
        console.log(productIds + "productIds")
  
        const koleksiyon = await Koleksiyon.findById(koleksiyonId);
  

        if (!koleksiyon) {
          return res.status(404).json({
            success: false,
            message: "Koleksiyon bulunamadı",
          });
        }
  
        for (const productId of productIds) {
          const product = await Product.findById(productId);
          if (product) {
            koleksiyon.productIds.push(productId);
          }
        }
            console.log(koleksiyon + "irfo");
        const koleksiyonSave = await Koleksiyon.save();
        console.log(koleksiyonSave + "loji");
  
        res.status(200).json({
          success: true,
          koleksiyonSave
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
router.get("/koleksiyons", async (req, res) => {
  try {
    const koleksiyons = await Koleksiyon.find();
    res.status(200).json({
        success: true,
        koleksiyons,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Belirli bir koleksiyonu getirme
router.get("/koleksiyons/:id", async (req, res) => {
  try {
    const koleksiyon = await Koleksiyon.findById(req.params.id);
    if (!koleksiyon) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({
        success: true,
        koleksiyon,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//güncelleme 
router.put("/koleksiyons/:id", async (req, res) => {
  try {
    const koleksiyon = await Koleksiyon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!koleksiyon) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({
        success: true,
        koleksiyon,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/koleksiyons/:id", async (req, res) => {
  try {
    const koleksiyon = await Koleksiyon.findByIdAndRemove(req.params.id);
    if (!koleksiyon) {
      return res.status(404).json({ error: "Koleksiyon bulunamadı." });
    }
    res.status(200).json({ message: "Koleksiyon başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
