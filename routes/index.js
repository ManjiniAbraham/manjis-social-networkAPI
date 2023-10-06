const router = require('express').Router();

// Import and use your API route modules here
const apiRoutes = require('./api');

// Prefix all API routes with /api
router.use('/api', apiRoutes);
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;
