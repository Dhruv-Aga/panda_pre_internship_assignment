var mongoose = require('mongoose');
var Promise = require('promise');
var router = require('express').Router();
var crypto = require('crypto');
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.post('/users/login', function(req, res, next) {

    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }
    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) { return next(err); }

        if (user) {
            user.token = user.generateJWT();
            var x = user.toJSONFor()
            return res.json({ user: x });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/users', function(req, res, next) {
    var re = /\S+@\S+\.\S+/;

    if (!req.body.user.name) {
        return res.status(422).json({ errors: "name " + "can't be blank" });
    }
    if (!req.body.user.mobile) {
        return res.status(422).json({ errors: "mobile no " + "can't be blank" });
    }
    if (!req.body.user.email) {
        return res.status(422).json({ errors: "email " + "can't be blank" });
    } else if (!re.test(req.body.user.email)) {
        return res.status(422).json({ errors: "email " + "format is wrong" });
    } else if (!User.find({ email: req.body.user.email }).then(function(user) { if (user) { return 0 } else { return 1 } }).catch(function(err) { return 0 })) {
        return res.status(422).json({ errors: "email " + "already registared" });
    }
    if (!req.body.user.password) {
        return res.status(422).json({ errors: "password " + "can't be blank" });
    }

    var user = new User();
    user.name = req.body.user.name;
    user.mobile = req.body.user.mobile;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function() {
        var x = user.toJSONFor()
        return res.json({ user: x });
    }).catch(next);
});

router.post('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});


router.post('/users/forget', auth.optional, function(req, res, next) {
    User.find({ 'email': req.body.users.email }).then(function(user) {
        if (!user) { return res.sendStatus(401); } else {
            var to = req.body.users.email; // list of receivers
            var subject = "Reset password for Prabuddha2.0"; // Subject line
            var newPass = Math.floor((Math.random(9999) * 100000) + 1) + "forget";
            var body = "Your new password is :" + newPass + ". Kindly change the password after login for first time.";
            var user_reset = new User(user);
            user_reset.setPassword(newPass);
            mailing(to, subject, body).then(function(result) {
                return res.sendStatus(200);
            })
            .catch(function(err) {
                return res.sendStatus(401);
            })
        }
    }).catch(next);;
});


router.post('/users/change', auth.required, function(req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    if (!req.body.user.new_password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) {
            return next(err); 
        }
        if (user) {
            user.setPassword(req.body.user.new_password);
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

module.exports = router;