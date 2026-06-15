const router = require('express').Router();
const controller = require('../controllers/authController');
const { auth, allowRoles } = require('../middleware/auth');
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', auth, controller.me);
router.get('/users', auth, allowRoles('admin', 'technician'), controller.users);
module.exports = router;
