const mongoose = require("mongoose");

const koleksiyonSchema = new mongoose.Schema({
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
    isShow:{
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Koleksiyon", koleksiyonSchema);



  
