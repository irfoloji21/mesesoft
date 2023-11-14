//about us model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutUsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
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
    status: { type: Boolean, default: false }
},
{ timestamps: true });


module.exports = mongoose.model('aboutUs', aboutUsSchema);