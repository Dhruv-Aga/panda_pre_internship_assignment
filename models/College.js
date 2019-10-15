var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var slug = require('slug')
var CollegeSchema = new mongoose.Schema({
    name:String
}, { timestamps: true });

CollegeSchema.plugin(uniqueValidator, { message: 'is already taken.' });
CollegeSchema.pre('validate', function(next) {
    if (!this.slug) {
        this.slugify();
    }
    next();
});

CollegeSchema.methods.slugify = function() {
    this.slug = slug(this.name) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};
CollegeSchema.methods.toJSONFor = function(user) {
    return user.name;
};

CollegeSchema.methods.toJSONForDetail = function(user) {
    return {
        name:user.name,
        id:user.id,
    };
};

mongoose.model('College', CollegeSchema);