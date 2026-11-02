const documentRequestService = require('./documentRequest.service');

const send = (res, status, data) => res.status(status).json({ success: true, data });

class DocumentRequestController {
  async list(req, res, next) {
    try {
      send(res, 200, await documentRequestService.list(req.user, { status: req.query.status }));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      send(res, 201, await documentRequestService.create(req.body, req.user));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      send(res, 200, await documentRequestService.update(req.params.id, req.body, req.user));
    } catch (error) {
      next(error);
    }
  }

  async remind(req, res, next) {
    try {
      send(res, 200, await documentRequestService.remind(req.params.id, req.user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentRequestController();
