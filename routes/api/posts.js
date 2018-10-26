const express = require('express');
const router = express.Router();

// Route: GET api/posts/test
// Desc: Tests posts route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Posts is working'
    });
});

module.exports = router;