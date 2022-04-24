const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// use the below for instances where endpoint doesn't exist
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;