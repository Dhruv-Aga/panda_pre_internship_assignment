var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    name: String,
    bio: String,
    mobile: Number,
    image: String,
    rides: [{
        booking_date: { type: Date },
        expected_return_date: { type: Date },
        return_date: { type: Date },
        ride_detail: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
        cost: Number,
        rating: Number,
        remark: String,
        verify_otp: String,
        timestamps: { type: Date, default: new Date() }
    }],
    hash: String,
    salt: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'Email is already taken' });

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        name: this.name,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.toJSONFor = function(user) {

    return {
        id: this._id,
        name: this.name,
        bio: this.bio,
        token: this.generateJWT(),
        email: this.email,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    };
};


mongoose.model('User', UserSchema);