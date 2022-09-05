const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactUs = new Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailId: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date : {type:String , required : true }
})






module.exports = mongoose.model('ContactUs', ContactUs)