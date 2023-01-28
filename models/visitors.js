const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const visit = new Schema({
  counter: {
    type: Number,
    required: true,
  },
});


module.exports = mongoose.model('visits',visit)