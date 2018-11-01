const express = require('express');
const gravatar = require('gravatar');
const mongoose = require('mongoose');
// Loading user model
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../../config/passport.js')(passport);
const router = express.Router();
const keys = require('../../config/keys');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Route: GET api/users/test
// Desc: Tests users route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Users is working'
    });
});

// Route: GET api/users/register
// Desc: Registers a new user
// Access: Public
router.post('/register', (req, res) => {
    // Validating registration
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "Email already exists." });
        } else {
            // creating a variable to store an avatar from gravatar
            // gravatar.url(email, options, protocol)...
            // getting email from body-parsed req

            const avatar = gravatar.url(req.body.email, {
                s: '200', // size
                r: 'pg', // rating
                d: 'mm' // default
            });

            // adding new user to schema using 
            // data from body-parser
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                password2: req.body.password2
            });

            // encrypting new user password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save().then((user) => {
                        res.json(user);
                    }).catch((err) => {
                        console.log(`Error occured when saving password hash to new user\n${err}`);
                    });
                    
                })
            })
        }
    });
});

// Route: GET api/users/login
// Desc: Logging in... returning a JWT token
// Access: Public
router.post('/login', (req, res) => {
    //Checking User Login
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
         return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({
        email
    }).then((User) => {
        // Checking for valid User
        if (!User) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }

        // Check password
        bcrypt.compare(password, User.password).then((isMatch) => {
            if (isMatch) {
                // User password matched
                // Creating payload for token
                const payload = {
                    id: User.id,
                    name: User.name,
                    avatar: User.avatar
                };
                // Signing token
                jwt.sign(
                    payload,
                    keys.secret,
                    { expiresIn: "10h" },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                errors.password = 'Password incorrect.'
                return res.status(400).json(errors)
            }
        });
    });
});

// Route: GET api/users/current
// Desc: returning current user
// Access: Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
});

module.exports = router;