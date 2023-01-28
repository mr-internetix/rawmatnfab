const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carouselImage = new Schema({
    imageurl: { type: String, required: true }
});




module.exports = mongoose.model('carouselImage', carouselImage);