const mongoose = require('mongoose');
const url = 'mongodb://localhost/mc';

mongoose.connect(url);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error:'));

module.exports = {
    mongoose,
    url,
    db
};
