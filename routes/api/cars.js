var router = require('express').Router();
var mongoose = require('mongoose');
var Cars = mongoose.model('Cars');
var User = mongoose.model('User');
var auth = require('../auth');
var jwt = require('jsonwebtoken');
var async = require('async');
var request = require('request');
var https = require('https');
var location = require('location-href')

router.post('/addCar', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var arr = ['vechile_registration_no', 'vechile_lic_plate_no', 'model', 'company', 'basic_rent_per_day', 'seat_capacity']
        for (i = 0; i < arr.length; i++) {
            if (!req.body.car[arr[i]]) {
                return res.status(422).json({ errors: arr[i].replace("_", " ") + " can't be blank" });
            }
        }
        var car = new Cars();
        car.vechile_registration_no = req.body.car.vechile_registration_no;
        car.vechile_lic_plate_no = req.body.car.vechile_lic_plate_no;
        car.driver_detail = req.payload.id;
        car.model = req.body.car.model;
        car.company = req.body.car.company;
        car.basic_rent_per_day = req.body.car.basic_rent_per_day;
        car.seat_capacity = req.body.car.seat_capacity;

        car.save().then(function() {
            var x = car.toJSONFor()
            return res.json({ user: x });

        }).catch(next);

    }).catch(next);
});

router.delete('/deleteCar', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        Cars.findOne({ _id: Object(req.body.car._id), '$or': [{ customer: { '$size': 0 } }, { "customer.return_date": { $not: { $eq: null } } }] }).then(function(car) {
            console.log(car)
            Cars.remove({ _id: Object(req.body.car._id) });
            return res.writeHead(200);
        }).catch(next);
    }).catch(next);
});

module.exports = router;