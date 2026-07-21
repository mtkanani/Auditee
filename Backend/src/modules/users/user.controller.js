const userService = require('./user.service');
const { USER_MESSAGES } = require('./user.constants');

class UserController {
  async createUser(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const createdBy = req.user.id;
      const user = await userService.createUser(req.body, firmId, createdBy);
      return res.status(201).json({
        success: true,
        message: USER_MESSAGES.CREATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const result = await userService.getAllUsers(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: USER_MESSAGES.FETCHED_ALL,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const user = await userService.getUserById(userId, firmId);
      return res.status(200).json({
        success: true,
        message: USER_MESSAGES.FETCHED_DETAILS,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const updatedUser = await userService.updateUser(userId, req.body, firmId);
      return res.status(200).json({
        success: true,
        message: USER_MESSAGES.UPDATED,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const result = await userService.deleteUser(userId, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeUserStatus(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const { status } = req.body;
      const updatedUser = await userService.changeUserStatus(userId, status, firmId);
      return res.status(200).json({
        success: true,
        message: USER_MESSAGES.STATUS_UPDATED,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetUserPassword(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const { password } = req.body;
      const result = await userService.resetUserPassword(userId, password, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const data = await userService.getDashboard(firmId);
      return res.status(200).json({
        success: true,
        message: 'Firm Admin dashboard metrics fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
