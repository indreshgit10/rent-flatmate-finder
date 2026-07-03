const express = require('express');
const controller = require('../controllers/listingController');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const { validateCreateListing, validateUpdateListing } = require('../validators/listingValidator');
const { checkValidation } = require('../validators/authValidator');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/owner/me', authenticate, requireRole('owner'), controller.getOwnerListings);
router.get('/', controller.getListings);
router.get('/:id', controller.getListingById);

router.post('/', authenticate, requireRole('owner'), upload.array('photos', 5), validateCreateListing, checkValidation, controller.createListing);
router.put('/:id', authenticate, requireRole('owner'), upload.array('photos', 5), validateUpdateListing, checkValidation, controller.updateListing);
router.patch('/:id/fill', authenticate, requireRole('owner'), controller.markAsFilled);
router.delete('/:id', authenticate, requireRole('owner'), controller.deleteListing);

module.exports = router;
