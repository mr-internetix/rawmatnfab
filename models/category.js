const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const category = new Schema({
    categoryName: { type: String, required: true },
    categoryImages: { type: Array, required: false },
    shortDescription: { type: String, required: true },
    itemDescription: { type: Object, required: true },
    metalComposition: { type: String, required: true },
    dimensionStandard: { type: String, required: true },
})




module.exports = mongoose.model('category', category)