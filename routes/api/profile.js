const express = require('express');
const router = express.Router();

// Route: GET api/profile/test
// Desc: Tests profile route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Profile is working'
    });
});

module.exports = router;