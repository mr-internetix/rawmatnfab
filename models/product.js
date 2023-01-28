const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const product = new Schema({
    categoryName: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    productDescription: { type: String, required: true },
    metalDescription: { type: String, required: true },
    dimensionComposition: { type: String, required: true },
    imageUrl: { type: Array, required: false }
})


module.exports = mongoose.model("product", product);