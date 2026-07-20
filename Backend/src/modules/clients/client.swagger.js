const clientSchemas = {
  CreateClientRequest: {
    type: 'object',
    required: ['clientName', 'email'],
    properties: {
      clientName: { type: 'string', example: 'Apex Logistics Pvt Ltd' },
      clientType: { type: 'string', example: 'COMPANY' },
      companyName: { type: 'string', example: 'Apex Logistics Private Limited' },
      email: { type: 'string', format: 'email', example: 'billing@apexlogistics.com' },
      password: { type: 'string', format: 'password', example: 'ClientPass@123' },
      phone: { type: 'string', example: '9876500000' },
      gstNumber: { type: 'string', example: '24ABCDE1234F1Z5' },
      panNumber: { type: 'string', example: 'ABCDE1234F' },
      businessType: { type: 'string', example: 'Logistics & Transportation' },
      address: { type: 'string', example: '101 Transport Hub' },
      city: { type: 'string', example: 'Ahmedabad' },
      state: { type: 'string', example: 'Gujarat' },
      country: { type: 'string', example: 'India' },
      pincode: { type: 'string', example: '380001' },
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    },
  },
  UpdateClientRequest: {
    type: 'object',
    properties: {
      clientName: { type: 'string', example: 'Apex Logistics LLP' },
      companyName: { type: 'string', example: 'Apex Logistics LLP' },
      email: { type: 'string', format: 'email', example: 'info@apexlogistics.com' },
      phone: { type: 'string', example: '9876500000' },
      gstNumber: { type: 'string', example: '24ABCDE1234F1Z5' },
      panNumber: { type: 'string', example: 'ABCDE1234F' },
      businessType: { type: 'string', example: 'Supply Chain' },
      address: { type: 'string', example: '202 Corporate Park' },
      city: { type: 'string', example: 'Ahmedabad' },
      state: { type: 'string', example: 'Gujarat' },
      country: { type: 'string', example: 'India' },
      pincode: { type: 'string', example: '380015' },
    },
  },
  ChangeClientStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'INACTIVE' },
    },
  },
};

const clientPaths = {
  '/api/firm-admin/clients': {
    post: {
      summary: 'Create Client',
      description: 'Firm Admin creates a Client belonging to their firm.',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClientRequest' } } },
      },
      responses: {
        201: { description: 'Client created successfully' },
        400: { description: 'Validation error / Email already exists' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' },
      },
    },
    get: {
      summary: 'Get All Clients',
      description: 'Fetch list of clients with pagination, search, status filter, and GST search.',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'gstSearch', in: 'query', schema: { type: 'string' } },
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] } },
        { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'createdAt' } },
        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
      ],
      responses: {
        200: { description: 'Clients fetched successfully' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' },
      },
    },
  },
  '/api/firm-admin/clients/{clientId}': {
    get: {
      summary: 'Get Client Details',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Client details fetched successfully' },
        404: { description: 'Client not found' },
      },
    },
    put: {
      summary: 'Update Client Details',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClientRequest' } } },
      },
      responses: {
        200: { description: 'Client updated successfully' },
        404: { description: 'Client not found' },
      },
    },
    delete: {
      summary: 'Soft Delete Client',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Client deleted successfully' },
        404: { description: 'Client not found' },
      },
    },
  },
  '/api/firm-admin/clients/{clientId}/status': {
    patch: {
      summary: 'Change Client Status',
      tags: ['Firm Admin - Clients'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangeClientStatusRequest' } } },
      },
      responses: {
        200: { description: 'Client status updated successfully' },
        404: { description: 'Client not found' },
      },
    },
  },
};

module.exports = { clientSchemas, clientPaths };
