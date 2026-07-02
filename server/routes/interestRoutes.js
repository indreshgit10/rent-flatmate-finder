const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const { validateInterest } = require('../validators/interestValidator');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.post('/', authenticate, requireRole('tenant'), validateInterest, interestController.sendInterest);
router.get('/received', authenticate, requireRole('owner'), interestController.getReceivedInterests);
router.get('/sent', authenticate, requireRole('tenant'), interestController.getSentInterests);
router.patch('/:id/accept', authenticate, requireRole('owner'), interestController.acceptInterest);
router.patch('/:id/decline', authenticate, requireRole('owner'), interestController.declineInterest);

module.exports = router;
