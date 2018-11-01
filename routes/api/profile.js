const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
// Load models
const profile = require('../../models/Profile');
const user = require('../../models/user');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Route: GET api/profile/test
// Desc: Tests profile route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Profile is working'
    });
});

// Route: GET api/profile
// Desc: Gets the current user's profile
// Access: Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    
    Profile.findOne({
        user: req.user.id
    }).populate('user', ['name']).then((profile) => {
        if (!profile) {
            console.log(err);
            errors.noprofile = 'No profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => res.status(404).json(err))
});

// Route: GET api/profile/all
// Desc: Listing all profiles
// Access: Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find().populate('user', ['name', 'avatar']).then((profiles) => {
        if (!profiles) {
            errors.noprofile = 'There are no profiles yet.';
            return res.status(404).json(errors);
        }
        res.json(profiles);
    }).catch((err) => {
        res.status(404).json({ msg: "There was a problem getting all the profiles :-(" });
    });
});

// Route: GET api/profile/handle/:handle
// Desc: Getting profile by handle
// Access: Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({
        handle: req.params.handle
    }).populate('user', ['name', 'avatar']).then((profile) => {
        if (!profile) {
            errors.noprofile = 'No profile for this handle';
            res.status(404).json(errors);
        }
        res.json(profile);
    }).catch((err) => {
        res.status(404).json({ msg: "There was a problem getting profile by handle :-(" });
    });
});

// Route: GET api/profile/user/:user_id
// Desc: Getting profile by userId
// Access: Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({
        user: req.params.user_id
    }).populate('user', ['name', 'avatar']).then((profile) => {
        if (!profile) {
            errors.noprofile = 'No profile for this user ID';
            res.status(400).json(errors);
        }
        res.json(profile);
    }).catch((err) => {
        res.status(404).json({ msg: "There was a problem getting profile by user ID :-(" });
    });
});

// Route: POST api/profile/experience
// Desc: Add experience to profile
// Access: Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validating experience input
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
    }
    
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        // Add to experience array
        profile.experience.unshift(newExp);
        profile.save().then((profile) => {
            res.json(profile);
        });
    })
});

// Route: POST api/profile/education
// Desc: Add education to profile
// Access: Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validating education input
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
        return res.status(400).json( errors );
    }
    
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        // Add to education array
        profile.education.unshift(newEdu);
        profile.save().then((profile) => {
            res.json(profile);
        });
    })
});

// Route: POST api/profile
// Desc: Creating or editing a new user profile
// Access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validating profiles
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    // Getting Profile fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) {
        profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
        profileFields.company = req.body.company;
    }
    if (req.body.website) {
        profileFields.website = req.body.website;
    }
    if (req.body.location) {
        profileFields.location = req.body.location;
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
        profileFields.status = req.body.status;
    }
    if (req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername;
    }
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    profileFields.social = {};
    if (req.body.youtube) {
        profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.linkedin) {
        profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.twitter) {
        profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.facebook) {
        profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
        profileFields.social.instagram = req.body.instagram;
    }

    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        if (profile) {
            // updating existing profile
            Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then((profile) => {
                res.json(profile);
            });
        } else {
            // Creating new profile
            // Check if handle exits
            Profile.findOne({
                handle: profileFields.handle
            }).then((profile) => {
                if (profile) {
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }
                // Saving new profile
                new Profile(profileFields).save().then((profile) => {
                    res.json(profile);
                });
            });
        }
    });
});

// Route: DELETE api/profile/experience/:exp_id
// Desc: Delete experience from profile
// Access: Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        
        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => {
            res.json(profile);
        }).catch((err) => {
            res.status(404).json(err);
        });
    });
});

// Route: DELETE api/profile/education/:edu_id
// Desc: Delete education from profile
// Access: Private
router.delete('/education/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        // Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        
        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => {
            res.json(profile);
        }).catch((err) => {
            res.status(404).json(err);
        });
    });
});

// Route: DELETE api/profile/
// Desc: Delete user and profile
// Access: Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({
        user: req.user.id
    }).then((profile) => {
        User.findOneAndRemove({
            _id: req.user.id
        }).then((profile) => {
            res.json({ msg: "Successfully 86'd that boi 8)" });
        });
    });
});

module.exports = router;