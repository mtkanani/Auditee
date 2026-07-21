const express = require('express');
const announcementController = require('./announcement.controller');
const {
  createAnnouncementValidation,
  announcementIdParamValidation,
} = require('./announcement.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const adminRouter = express.Router();
adminRouter.use(authenticateSession);
adminRouter.use(authorizeRoles('FIRM_ADMIN'));

adminRouter.post('/', createAnnouncementValidation, validate, announcementController.createAnnouncement);
adminRouter.get('/', announcementController.getAllFirmAnnouncements);
adminRouter.get('/:id/analytics', announcementIdParamValidation, validate, announcementController.getAnnouncementAnalytics);
adminRouter.delete('/:id', announcementIdParamValidation, validate, announcementController.deleteAnnouncement);

const userRouter = express.Router();
userRouter.use(authenticateSession);

userRouter.get('/', announcementController.getUserActiveNotices);
userRouter.post('/:id/acknowledge', announcementIdParamValidation, validate, announcementController.acknowledgeNotice);

module.exports = {
  adminRouter,
  userRouter,
};
