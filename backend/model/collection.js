const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
    productIds:{
        type: Array,
        required: false,
    },
    images: [
      {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
    ],
    saving: {
      type: Number,
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



  
