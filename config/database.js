const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') });





function connect_database() {
    mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log("Database Connected");
    }).on('error', (err) => {
        console.log(err)
    })


}


module.exports = connect_database;