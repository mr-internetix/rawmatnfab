const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const careerInfo = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    qualification: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    date : { type : String , required : true  }


});


module.exports = mongoose.model('careerInfo', careerInfo);