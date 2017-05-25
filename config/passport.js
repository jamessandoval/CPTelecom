var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var connection = require('../models/dbconnect');
var flash = require('connect-flash');

var saltRounds = 10;

module.exports = function(passport) {


    // Required for persistent sessions
    //

    passport.serializeUser(function(user, done) {
        done(null, user.id)

    });

    passport.deserializeUser(function(id, done) {

        connection.query("SELECT * FROM user where id = ?", [id], function(err, rows) {
            done(err, rows[0]);
        });

    });


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true

        }, function(req, email, password, done) {
          if (req.body.password !== req.body.passwordDup) {
            return done(null, false, req.flash('message', 'Passwords do not match'));
          }
            connection.query("SELECT * FROM user WHERE email = ?", [email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('message', 'That email is already taken.'));

                } else {

                    bcrypt.hash(password, saltRounds, function(err, hash) {

                        var newUserQuery = {
                            email: email,
                            password: hash

                        };

                        var insertQuery = "INSERT INTO user ( email, password ) values (?,?)";

                        connection.query(insertQuery, [newUserQuery.email, newUserQuery.password], function(err, rows) {
                            newUserQuery.id = rows.insertId;
                            return done(null, newUserQuery, req.flash('message', 'Account Created and Logged In'));
                        });
                    });

                }

            });

        })

    );

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        connection.query("SELECT * FROM user WHERE email = ? ", [email], function(err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('message', 'Email address not found'));
            }
            bcrypt.compare(password, rows[0].password, function(err, res) {
                // res == true
                if(res){
                    return done(null, rows[0], req.flash('message', 'Login Successful'));
                } else {
                    return done(null, false, req.flash('message', 'Incorrect Password'));
                }

            });

        });

    }));


};
