const userService = require('../services/user.service');

/**
 * Controller handler for GET /api/users
 * Extracts query parameters, invokes the userService, and returns success payloads.
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, sortBy, sortOrder } = req.query;

    // Fetch records passing extracted query details
    const result = await userService.fetchUsers({
      page,
      limit,
      search,
      role,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      pagination: result.pagination,
      filters: result.filters,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler for PUT /api/users/update-profile
 * Extracts profile parameters and invokes user service.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { userId, ...updateData } = req.body;

    // Authorization Check: Secure route so a user can only update their own profile
    if (req.user.id !== userId) {
      const { UnauthorizedError } = require('../utils/errors');
      throw new UnauthorizedError('You are not authorized to update this profile.');
    }

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateProfile,
};
