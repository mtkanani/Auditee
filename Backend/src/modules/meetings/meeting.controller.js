const meetingService = require('./meeting.service');

class MeetingController {
  async schedule(req, res, next) {
    try {
      const meeting = await meetingService.scheduleMeeting(req.user, req.body);
      return res.status(201).json({
        success: true,
        message: 'Meeting scheduled successfully!',
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const meetings = await meetingService.getMeetings(req.user, req.query);
      return res.status(200).json({
        success: true,
        data: meetings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const meeting = await meetingService.getMeetingById(req.params.id);
      return res.status(200).json({
        success: true,
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const meeting = await meetingService.updateMeetingStatus(req.params.id, req.body.status);
      return res.status(200).json({
        success: true,
        message: 'Meeting status updated!',
        data: meeting,
      });
    } catch (error) {
      next(error);
    }
  }

  async respondInvite(req, res, next) {
    try {
      const participant = await meetingService.respondInvitation(req.user, {
        meetingId: req.params.id,
        status: req.body.status,
      });
      return res.status(200).json({
        success: true,
        message: `Invitation ${req.body.status.toLowerCase()} successfully!`,
        data: participant,
      });
    } catch (error) {
      next(error);
    }
  }

  async joinMeeting(req, res, next) {
    try {
      const attendance = await meetingService.recordJoinAttendance(req.user, req.params.id);
      const meeting = await meetingService.getMeetingById(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Joined meeting room successfully!',
        data: { attendance, meeting },
      });
    } catch (error) {
      next(error);
    }
  }

  async addNote(req, res, next) {
    try {
      const note = await meetingService.addMeetingNote(req.user, {
        meetingId: req.params.id,
        ...req.body,
      });
      return res.status(201).json({
        success: true,
        message: 'Meeting note saved!',
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  async convertMoM(req, res, next) {
    try {
      const result = await meetingService.convertMoMToTasks(req.user, {
        meetingId: req.params.id,
        notesText: req.body.notesText || req.body.description || '',
      });
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.tasks,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeetingController();
