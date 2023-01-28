const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mission = new Schema({
    mission : { type : String , required : true },
    vision : { type : String , required : true },
    goal : { type : String , required : true }

});



module.exports = mongoose.model('mission' ,mission)