const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const { validateInterest } = require('../validators/interestValidator');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.post('/', authenticate, requireRole('tenant'), validateInterest, interestController.sendInterest);

module.exports = router;
