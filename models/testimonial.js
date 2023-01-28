const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const testimonial = new Schema({
    id : { type : String , required : true},
    name : { type : String , required : true},
    position : { type : String , required : true},
    photoUrl : { type : Array , required : false},
    text : { type : String , required : true}
})



module.exports = mongoose.model('testimonial', testimonial)