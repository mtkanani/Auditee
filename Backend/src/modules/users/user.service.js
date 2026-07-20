const bcrypt = require('bcryptjs');
const userRepository = require('./user.repository');
const { USER_MESSAGES } = require('./user.constants');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class UserService {
  async createUser(userData, firmId, createdBy) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError(USER_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: userData.phone ? userData.phone.trim() : null,
      designation: userData.designation ? userData.designation.trim() : null,
      status: userData.status || 'ACTIVE',
      profileImage: userData.profileImage || null,
      joiningDate: userData.joiningDate ? new Date(userData.joiningDate) : null,
      role: 'USER',
      firmId,
      createdBy,
    });

    return newUser;
  }

  async getAllUsers(queryParams, firmId) {
    return await userRepository.findAll({ ...queryParams, firmId });
  }

  async getUserById(userId, firmId) {
    const user = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!user) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }
    return user;
  }

  async updateUser(userId, updateData, firmId) {
    const existing = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!existing) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }

    if (updateData.email && updateData.email.toLowerCase().trim() !== existing.email) {
      const emailTaken = await userRepository.findByEmail(updateData.email.toLowerCase().trim());
      if (emailTaken) {
        throw new BadRequestError(USER_MESSAGES.EMAIL_EXISTS);
      }
    }

    const payload = {};
    if (updateData.firstName) payload.firstName = updateData.firstName.trim();
    if (updateData.lastName) payload.lastName = updateData.lastName.trim();
    if (updateData.email) payload.email = updateData.email.toLowerCase().trim();
    if (updateData.phone !== undefined) payload.phone = updateData.phone ? updateData.phone.trim() : null;
    if (updateData.designation !== undefined) payload.designation = updateData.designation ? updateData.designation.trim() : null;
    if (updateData.profileImage !== undefined) payload.profileImage = updateData.profileImage || null;
    if (updateData.joiningDate !== undefined) payload.joiningDate = updateData.joiningDate ? new Date(updateData.joiningDate) : null;

    await userRepository.update(userId, firmId, payload);
    return await userRepository.findByIdAndFirmId(userId, firmId);
  }

  async deleteUser(userId, firmId) {
    const existing = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!existing) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }
    await userRepository.softDelete(userId, firmId);
    return { message: USER_MESSAGES.DELETED };
  }

  async changeUserStatus(userId, status, firmId) {
    const existing = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!existing) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }
    await userRepository.update(userId, firmId, { status });
    return await userRepository.findByIdAndFirmId(userId, firmId);
  }

  async resetUserPassword(userId, password, firmId) {
    const existing = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!existing) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updatePassword(userId, firmId, hashedPassword);
    return { message: USER_MESSAGES.PASSWORD_RESET };
  }
}

module.exports = new UserService();
