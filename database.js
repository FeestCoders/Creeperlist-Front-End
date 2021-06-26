require('dotenv').config()
const mongoose = require('mongoose');
const url = process.env.MONGOURL;
mongoose.Promise = global.Promise;
mongoose.connect(url, {useMongoClient:true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error:'));

module.exports = {
    mongoose,
    url,
    db
};
