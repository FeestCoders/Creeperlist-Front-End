const mongoose = require('../database').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: String,
    displayName: {
        type: String,
        required: true
    },
    registered: {
        type: Date,
        default: Date.now
    }
});
userSchema.statics.findUser = function (name, cb) {
    this.findOne({
        $or: [{
            'username': name
        }, {
            '_id': name
        }]
    }, cb);
};
module.exports = mongoose.model('User', userSchema);
