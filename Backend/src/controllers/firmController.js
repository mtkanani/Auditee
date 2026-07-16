const firmService = require('../services/firmService');

/**
 * Controller handler to create a new Firm and its respective Firm Admin.
 */
const createFirm = async (req, res, next) => {
  try {
    const { firm, firmAdmin } = req.body;

    const result = await firmService.createFirm(firm, firmAdmin);

    return res.status(201).json({
      success: true,
      message: 'Firm and Firm Admin created successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to fetch all firms with pagination, search, and status filter support.
 */
const getFirms = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;

    const result = await firmService.getFirms({ page, limit, search, status });

    return res.status(200).json({
      success: true,
      message: 'Firms retrieved successfully.',
      pagination: result.pagination,
      filters: result.filters,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to fetch a specific firm by its ID.
 */
const getFirmById = async (req, res, next) => {
  try {
    const { firmId } = req.params;

    const firm = await firmService.getFirmById(firmId);

    return res.status(200).json({
      success: true,
      message: 'Firm details retrieved successfully.',
      data: firm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to update a firm's details.
 */
const updateFirm = async (req, res, next) => {
  try {
    const { firmId } = req.params;
    const updateData = req.body;

    const updatedFirm = await firmService.updateFirm(firmId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Firm details updated successfully.',
      data: updatedFirm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to update the Firm Admin user details.
 */
const updateFirmAdmin = async (req, res, next) => {
  try {
    const { firmId } = req.params;
    const adminData = req.body;

    const updatedAdmin = await firmService.updateFirmAdmin(firmId, adminData);

    return res.status(200).json({
      success: true,
      message: 'Firm Admin details updated successfully.',
      data: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to change a firm's status (ACTIVE/INACTIVE/SUSPENDED).
 */
const changeFirmStatus = async (req, res, next) => {
  try {
    const { firmId } = req.params;
    const { status } = req.body;

    const updatedFirm = await firmService.changeFirmStatus(firmId, status.toUpperCase());

    return res.status(200).json({
      success: true,
      message: `Firm status updated to ${status.toUpperCase()} successfully.`,
      data: updatedFirm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to reset the Firm Admin's password.
 */
const resetFirmAdminPassword = async (req, res, next) => {
  try {
    const { firmId } = req.params;
    const { newPassword } = req.body;

    const result = await firmService.resetFirmAdminPassword(firmId, newPassword);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to soft delete a firm.
 */
const deleteFirm = async (req, res, next) => {
  try {
    const { firmId } = req.params;

    const result = await firmService.deleteFirm(firmId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFirm,
  getFirms,
  getFirmById,
  updateFirm,
  updateFirmAdmin,
  changeFirmStatus,
  resetFirmAdminPassword,
  deleteFirm,
};
