const express = require('express');
const clientController = require('./client.controller');
const {
  createClientValidation,
  getClientsValidation,
  clientIdParamValidation,
  updateClientValidation,
  changeClientStatusValidation,
  addServiceValidation,
  addDocumentValidation,
} = require('./client.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);
router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createClientValidation, validate, clientController.createClient);
router.get('/', getClientsValidation, validate, clientController.getAllClients);
router.get('/:clientId', clientIdParamValidation, validate, clientController.getClientById);
router.put('/:clientId', updateClientValidation, validate, clientController.updateClient);
router.delete('/:clientId', clientIdParamValidation, validate, clientController.deleteClient);
router.patch('/:clientId/status', changeClientStatusValidation, validate, clientController.changeClientStatus);

// Sub-resource Routes
router.post('/:clientId/services', addServiceValidation, validate, clientController.addService);
router.delete('/:clientId/services/:serviceId', clientIdParamValidation, validate, clientController.removeService);

router.post('/:clientId/documents', addDocumentValidation, validate, clientController.addDocument);
router.delete('/:clientId/documents/:documentId', clientIdParamValidation, validate, clientController.deleteDocument);

router.get('/:clientId/history', clientIdParamValidation, validate, clientController.getClientHistory);

module.exports = router;
