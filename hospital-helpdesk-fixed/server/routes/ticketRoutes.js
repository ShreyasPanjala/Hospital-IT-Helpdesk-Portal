const router = require('express').Router();
const controller = require('../controllers/ticketController');
const { auth, allowRoles } = require('../middleware/auth');
router.post('/', auth, controller.createTicket);
router.get('/', auth, controller.getTickets);
router.patch('/:id', auth, allowRoles('admin', 'technician'), controller.updateTicket);
router.get('/analytics/summary', auth, controller.analytics);
router.get('/reports/download', auth, controller.report);
module.exports = router;
