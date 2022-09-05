const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const about = new Schema({
    about : { type : String , required : true }
});



module.exports = mongoose.model('about' , about)


