const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { validateProfile } = require('../validators/profileValidator');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.post('/', authenticate, requireRole('tenant'), validateProfile, profileController.createProfile);
router.get('/', authenticate, requireRole('tenant'), profileController.getProfile);

module.exports = router;
