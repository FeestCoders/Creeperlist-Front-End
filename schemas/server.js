const mongoose = require('../database').mongoose;
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

const serverSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
       // validate: {
       //     validator: function (v) {
       //         let re;
       //         if (v && v.length) re = /^[a-z]$/i;
       //         return re.test(v);
       //     },
       // }
    },
    port: {
        type: Number,
        default: 25565
    },
    ip: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    games: {
        type: [String]
    },
    youtube: String,
    owner: {
        type: String,
        ref: 'User'
    },

    // System
    likes: {
        type: Number,
        default: 0
    },
    registered: {
        type: Date,
        default: Date.now
    },

    times: {
        type: Number,
        default: 1
    },
    lastcheck: Date,

    success: {
        type: Number,
        default: 1
    },
    ping: Number,
    icon: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH4QcFDAM2eb9xmwAAArNJREFUeNrtmu1P2lAUh59z200nKA43dDMxMdmy///vmQyDvAqICLRFoHcfmjFZcBmu7dF4n4SE8qH5naf35fQGGU8CyyvGaAfQxgnQDqCNE6AdQBsnQDuANk6AdgBtnADtANo4AdoBtHECtANo4wRoB9DGCdAOoI0ToB1AGz/Lm1ub3oGziLwcAbPZnFanTxjNUrmfMYaj8gEfyqXURWQyBVqdPtf9ITwYAE+NLQjR7J7LeocgnJH2QEh9BFhriaJ7ioV3fPt6hjFJ4ji2q+9bCRDh5nbM94sr5vMFicr0plY2a4AkT84YYb5Y0mr3mAYzDksFTipHeN6/DzwRwYg8fQipCHhAq92n2e4DMLqb4Ps+J5XyxgXSWpvZYvcYmW6DcWwJwghInqS1yfWfxYsIQRhRrTUZT4JcJWQqwBjhsFTEGIO1Ft/3Ke0X1goUEaZBRLXWotsbUr1s5Soh8ylwUinj+x5BMOPgoMD7UnE1An4X3+RuPE2upyEXtSZfzk/ZL+69fAHGGI4/loH1xmhT8avfc5SQSytsrWWxWFJvdLnuDQE2Fr8mZxpSrTUJw3SaqcfIfAQALOOYerNLuzPA9z1m8zm3o8nG4tckBBFBGG21bT47Acs4pt7o0ukOAFgsllw1rldF/o08lsGMX4ag2erR7gxyKOUZCohtzN14Shz/anC2bGFFUmx6FQQIwu7uDsXFcut93ZJMAd/zSLP3z0eATT5ihPOzT/91LuD7HsPR+OUIEBHe7rxhcDPi4kcjlY4uiu4REXzfe/4CAD4fHxEv4xQPRISz0wqFvd1UT5kAJKs/SlpriVMKKyQdZRZktgiKCF7Or7ZP4dWfCjsB2gG0cQK0A2jjBGgH0MYJ0A6gjROgHUAbJ0A7gDZOgHYAbZwA7QDaOAHaAbRxArQDaPMTI5YUsZsE73oAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDctMDVUMTI6MDM6NTQtMDU6MDBki+G0AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA3LTA1VDEyOjAzOjU0LTA1OjAwFdZZCAAAAABJRU5ErkJggg=="
    },
    players: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 20
    },
    motd: String,
    version: {
        type: String,
        default: "Unknown"
    },
    automatic: Boolean,
    top: {
        type: Boolean,
        default: false
    },

    // Votifier
    votifier_ip: String,
    votifier_port: Number,
    votifier_key: String
});

/**
 * @return {string}
 */
function getYoutube(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}
function isValidObjectID(str) {
    // coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
    str = str + '';
    let len = str.length, valid = false;
    if (len === 12 || len === 24) {
        valid = /^[0-9a-fA-F]+$/.test(str);
    }
    return valid;
}

serverSchema.index({name: 'text', ip: 'text', description: 'text', games: 'text'});
serverSchema.plugin(mongoosePaginate);

serverSchema.statics.findById = function (id, cb) {
    let objId = new ObjectId(!isValidObjectID(id) ? "123456789012" : id);
    return this.findOne({$or: [{'_id': objId}, {'name': id}]}, cb);
};
serverSchema.virtual('fullip').get(function () {
    return this.ip + ((this.port && this.port !== 25565) ? ':' + this.port : '');
});
serverSchema.virtual('embed').get(function () {
    return 'https://www.youtube.com/embed/' + getYoutube(this.youtube);
});
module.exports = mongoose.model('Server', serverSchema);
