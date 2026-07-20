const express = require('express');
const clientController = require('./client.controller');
const {
  createClientValidation,
  getClientsValidation,
  clientIdParamValidation,
  updateClientValidation,
  changeClientStatusValidation,
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

module.exports = router;
