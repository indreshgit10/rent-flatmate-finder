const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/users', adminController.getUsers);
router.patch('/users/:id/disable', adminController.disableUser);
router.patch('/users/:id/enable', adminController.enableUser);
router.get('/listings', adminController.getAllListings);

module.exports = router;
