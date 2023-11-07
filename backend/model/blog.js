const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    name: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    category: {
        type: String,
        required: [true, "Please enter your product category!"],
      },
      tags: {
        type: String,
      },
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    reviews: [
        {
          user: {
            type: Object,
          },
          email: {
            type: String,
          },
          name: {
            type: String,
          },
          reviewTitle: {
            type: String,
          },
          comment: {
            type: String,
          },
          blogId: {
            type: String,
          },
          createdAt:{
            type: Date,
            default: Date.now(),
          }
        },
      ],
    ratings: {
        type: Number,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);




// [
//     { "public_id": "products/rqdmaepqnwpkurt8csbw", "url": "https://res.cloudinary.com/dzzwb9qoz/image/upload/v1696082963/products/rqdmaepqnwpkurt8csbw.jpg", "_id": { "$oid": "65182c17abe97117b02128bc" } },
//     { "public_id": "products/hn6jo8v9z1ydsgggefxj", "url": "https://res.cloudinary.com/dzzwb9qoz/image/upload/v1696082964/products/hn6jo8v9z1ydsgggefxj.jpg", "_id": { "$oid": "65182c17abe97117b02128bd" } }, 
//     { "public_id": "products/seljxxphcrcq7yoou7od", "url": "https://res.cloudinary.com/dzzwb9qoz/image/upload/v1696082965/products/seljxxphcrcq7yoou7od.jpg", "_id": { "$oid": "65182c17abe97117b02128be" } }, 
//     { "public_id": "products/gspciv78ilvcj3i0njru", "url": "https://res.cloudinary.com/dzzwb9qoz/image/upload/v1696082966/products/gspciv78ilvcj3i0njru.jpg", "_id": { "$oid": "65182c17abe97117b02128bf" } }, 
//     { "public_id": "products/eci7afhj0dqhnhdqe8qk", "url": "https://res.cloudinary.com/dzzwb9qoz/image/upload/v1696082967/products/eci7afhj0dqhnhdqe8qk.jpg", "_id": { "$oid": "65182c17abe97117b02128c0" } }
// ]
