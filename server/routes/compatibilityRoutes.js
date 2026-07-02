const express = require('express');
const router = express.Router();
const compatibilityController = require('../controllers/compatibilityController');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.get('/:listingId', authenticate, requireRole('tenant'), compatibilityController.getScore);

module.exports = router;
