const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the category name!"],
  },
  subcategories: [
    {
      type: Object,
      ref: "Category",
    },
  ],    
  parentCategory: {
    type: Object,
    ref: "Category",
    default: null,
  },
  description: {
    type: String,
    required: [true, "Please enter the category description!"],
  },
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
  isShow: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Category", categorySchema);
