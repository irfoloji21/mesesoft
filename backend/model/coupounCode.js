const mongoose = require("mongoose");

const coupounCodeSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please enter your coupoun code name!"],
        unique: true,
    },
    code:{
        type: String,
        required:[true,"Please enter your coupoun code!"],
        unique: true,
    },
    start_date: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        }
    },
    end_date: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        }
    },
    free_shipping:{
        type: Boolean,
        default: false,
    },
    quantity:{
        type: Number,
        required: true,
    },
    discount_type:{
        type: String,
        enum: ["percentage","fixed"],
        default: "percentage",
    },
    status:{
        type: Boolean,
    },
    category:[{
        type: String,
    }],
    min:{
        type: Number,
    },
    max:{
        type: Number,
    },
    shopId:{
     type: String,
     required: true,
    },
    products: [{
        type: String  
    }],
    limit:{
        type: Number,
        required: false,
    },
    customer:{
        type: Number,
        required: false,
    },
    value:{
        type: Number,
        required: false,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);