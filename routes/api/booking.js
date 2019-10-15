var router = require('express').Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');
var Cars = mongoose.model('Cars');
var auth = require('../auth');
var jwt = require('jsonwebtoken');
var async = require('async');
var request = require('request');
var https = require('https');
var location = require('location-href')

router.get('/cars', function(req, res, next) {
	var advance_filter = {};

	if(req.query){
		advance_filter = {
			seat_capacity: req.query.seat_capacity,
			$or: [
						{
							"customer.expected_return_date": {$gt: req.query.date_from},
						},
						{
							"customer.booking_date": {$gt: req.query.date_to}
						}
				],
			basic_rent_per_day: {$gt: req.query.from_price, $lt: req.query.to_price}
		}
	}

    Cars.find({ '$or': [ { customer: { '$size': 0 } },  {"customer.return_date": {$not: {$eq:  null} } }, advance_filter] }, { customer: { $slice: -1 } }).then(function(cars) {
        res.writeHead(200);
        return res.end(JSON.stringify({ cars: cars }));
    })
});

function randomNumber() {
    return crypto.randomBytes(2).toString('hex');
}

router.post('/bookRide', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        console.log(req.body.car)
        Cars.findById(req.body.car._id).then(function(car) {
            if (!car) { return res.sendStatus(401); }
            var passenger = {
                booking_date: req.body.car.booking_date,
                expected_return_date: req.body.car.expected_return_date,
                ride_detail: req.body.car._id,
                cost: req.body.car.cost,
                verify_otp: randomNumber(),
            }

            User.update({_id:req.payload.id}, { $push: { rides: passenger } }).then(function(done) {
            	passenger.ride_detail = req.payload.id
                Cars.update({_id:req.body.car._id}, { $push: { customer: passenger } }).then(function(done) {
                    return res.writeHead(200);
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
});

router.get('/checkBooking', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        console.log(user)
        Cars.findById(user.rides[user.rides.length - 1].ride_detail, {customer: 0}).then(function(car) {
            if (!car) { return res.sendStatus(401); }
        	return res.end(JSON.stringify({ "cars": car }));
        }).catch(next);
    }).catch(next);
});

module.exports = router;