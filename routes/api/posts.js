const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();
// Load Post Model
const Post = require('../../models/Posts');
// Load Profile Model
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

// Route: GET api/posts/test
// Desc: Tests posts route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Posts is working'
    });
});

// Route: GET api/posts
// Desc: Get all posts
// Access: Public
router.get('/', (req, res) => {
    Post.find().sort({
        date: -1
    }).then((posts) => {
        res.json(posts);
    }).catch((err) => {
        res.status(404).json({ nopostsfound: "Problem with getting posts :-(" });
    });
});

// Route: GET api/posts/:id
// Desc: Get post by id
// Access: Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
        res.json(post);
    }).catch((err) => {
        res.status(404).json({ nopostfound: "Problem with getting post by ID :-(" });
    });
});

// Route: POST api/posts
// Desc: Create a post
// Access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validating posts
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then((post) => {
        res.json(post);
    })
});

// Route: POST api/posts/like/:id
// Desc: Liking a post
// Access: Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        Post.findById(req.params.id).then((post) => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyLiked: 'User already liked this post' });
            }

            // Add User ID to likes array
            post.likes.push({ user: req.user.id });
            post.save().then((post) => {
                res.json(post);
            });
        });
    });
});

// Route: POST api/posts/unlike/:id
// Desc: Unliking a post
// Access: Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        Post.findById(req.params.id).then((post) => {
            console.log(post);
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({ notLiked: 'You have not liked this post' });
            }

            // Get Remove Index
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            // Remove from likes array
            post.likes.splice(removeIndex, 1);
            post.save().then((post) => {
                res.json(post);
            });
        });
    });
});

// Route: DELETE api/posts/:id
// Desc: Deleting a post
// Access: Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        Post.findById(req.params.id).then((post) => {
            // Check for post owner
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ notauthorized: 'User not authorized' });
            }
            // Delete Post
            post.remove().then(() => {
                res.json({ success: true });
            }).catch((err) => {
                console.log(":(");
                res.status(404).json({ postnotfound: 'No post found' });
            });
        });
    });
});

// --------------------- COMMENTS --------------------------- //

// Route: POST api/posts/comment/:id
// Desc: Commenting on a post
// Access: Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Validating new comments
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    Post.findById(req.params.id).then((post) => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        // Add User ID to comments array
        post.comments.push(newComment);
        post.save().then((post) => {
            res.json(post);
        }).catch((err) => {
            res.status(404).json({ postnotfound: "No post found" });
        });
    });
});

// Route: DELETE api/posts/comment/:id/:comment_id
// Desc: Deleting a comment
// Access: Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {    
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        Post.findById(req.params.id).then((post) => {
            console.log(post);
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(400).json({ commentnotexists: 'You have not commented this post' });
            }

            // Get Remove Index
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
            // Remove from likes array
            post.comments.splice(removeIndex, 1);
            post.save().then((post) => {
                res.json(post);
            });
        });
    });
});

module.exports = router;