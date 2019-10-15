var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var secret = require('../config').secret;

var CarsSchema = new mongoose.Schema({
    vechile_registration_no: String,
    vechile_lic_plate_no: String,
    driver_detail: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    model: String,
    company: String,
    basic_rent_per_day: Number,
    seat_capacity: Number,
    customer: [
        {   
            booking_date: { type: Date},
            expected_return_date: { type: Date},
            return_date: { type: Date},
            ride_detail: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            cost: Number,
            rating: Number,
            remark: String,
            verify_otp: String,
            timestamps: { type: Date, default: new Date() },
        }
    ],
}, { timestamps: true });

CarsSchema.plugin(uniqueValidator, { message: 'Car already Registered' });

CarsSchema.methods.toJSONFor = function() {

    return {
        vechile_registration_no: this.vechile_registration_no,
        vechile_lic_plate_no: this.vechile_lic_plate_no,
        model: this.model,
        company: this.company,
        seat_capacity: this.seat_capacity,
        cost: this.cost,
        driver_detail: this.driver_detail
    };
};

mongoose.model('Cars', CarsSchema);