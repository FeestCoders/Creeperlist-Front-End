const express = require('express');
const router = express.Router();

const User = require('../schemas/user');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findUser(id, function(err, user) {
        done(err, user);
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/login', function (req, res) {
    if(!req.user) {
        res.render('login', {title: 'Iniciar sesión'});
    } else {
        res.redirect('/');
    }
});

const url = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https//creeperlist.bennocraft.net';

// Facebook
passport.use(new FacebookStrategy({
        clientID: '486149032447643',
        clientSecret: 'd64a83c3a9f06244e568b96f652d9d4b',
        callbackURL: url + "/auth/facebook/callback"
    },
    function(a, b, profile, done) {
        User.findUser(profile.id, function (err, user) {
            if (err) return done(err);

            if (!user) {
                user = new User({
                    displayName: profile.displayName,
                    _id: profile.id
                });
                user.save(function (err) {
                    if (err) return showerror(err);
                });
            }
            done(null, user);
        });
    }
));
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// Twitter
passport.use(new TwitterStrategy({
        consumerKey: 'zSJg2YeoBi0RRXo19BHfgUL5j',
        consumerSecret: 'mjOKRADpsV4MBrHm0kSlq1XYUBgpchRvSLrwaD0VG0jJtnnNlZ',
        callbackURL: url + "/auth/twitter/callback"
    },
    function(a, b, profile, done) {
        User.findUser(profile.id, function (err, user) {
            if (err) return done(err);

            if (!user) {
                user = new User({
                    displayName: profile.displayName,
                    _id: profile.id
                });
                user.save(function (err) {
                    if (err) return showerror(err);
                });
            }
            done(null, user);
        });
    }
));
router.get('/auth/twitter', passport.authenticate('twitter', {scope: 'email'}));
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/'
    }));


// Google
passport.use(new GoogleStrategy({
        clientID: '415305972290-h4ugcqlh6ov2kqg76t9hdjg15pk5kice.apps.googleusercontent.com',
        clientSecret: 'fJHGgTpUaUpWofT1aZwqFLtk',
        callbackURL: url + "/auth/google/callback"
    },
    function(a, b, profile, done) {
        User.findUser(profile.id, function (err, user) {
            if (err) return done(err);

            if (!user) {
                user = new User({
                    displayName: profile.displayName,
                    _id: profile.id
                });
                user.save(function (err) {
                    if (err) return showerror(err);
                });
            }
            done(null, user);
        });
    }
));
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

function showerror(err) {
    console.log(err);
}
module.exports = router;