const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    productIds:{
        type: Array,
        required: true,
    },
    image:{
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
     },
    save: {
      type: Number,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    shopId:{
        type: String,
        required: true,
    },
    shop:{
        type: Object,
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);



  
