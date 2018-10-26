const express = require('express');
const router = express.Router();

// Route: GET api/users/test
// Desc: Tests users route
// Access: Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Users is working'
    });
});

module.exports = router;