const express = require('express');
const router = express.Router();
const meetingController = require('./meeting.controller');
const { authenticateSession } = require('../../middlewares/auth.middleware');

// All meeting routes require authentication
router.use(authenticateSession);

router.post('/', meetingController.schedule);
router.get('/', meetingController.getAll);
router.get('/:id', meetingController.getById);
router.patch('/:id/status', meetingController.updateStatus);
router.post('/:id/respond', meetingController.respondInvite);
router.post('/:id/join', meetingController.joinMeeting);
router.post('/:id/notes', meetingController.addNote);
router.post('/:id/convert-mom', meetingController.convertMoM);

module.exports = router;
