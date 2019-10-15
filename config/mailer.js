var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dhruv.1610051@kiet.edu', // Your email id
        pass: 'come2future' // Your password
    }
});
// var text = 'Hello world from \n\n' + "req.body.name";

module.exports = function() {
    this.mailing = function(to, subject, body) {
        return new Promise(function(resolve, reject) {
            var mailOptions = {
                from: 'prabuddha.kiet@gmail.com', // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: body //, // plaintext body
            };
            console.log("sd")
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                     reject(error)
                } else {
                    resolve("SUCCESS")
                };
            });
        });

    }
}