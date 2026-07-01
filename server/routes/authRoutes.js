const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin, checkValidation } = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.use(authLimiter);

router.post('/register', validateRegister, checkValidation, register);
router.post('/login', validateLogin, checkValidation, login);

module.exports = router;
