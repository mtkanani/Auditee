const publicClientSchemas = {
  UpdateClientProfileRequest: {
    type: 'object',
    properties: {
      clientName: { type: 'string', example: 'Apex Logistics' },
      companyName: { type: 'string', example: 'Apex Logistics Pvt Ltd' },
      phone: { type: 'string', example: '9876500000' },
      address: { type: 'string', example: '101 Corporate Hub' },
      city: { type: 'string', example: 'Ahmedabad' },
      state: { type: 'string', example: 'Gujarat' },
      pincode: { type: 'string', example: '380001' },
    },
  },
  CreateWorkRequest: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', example: 'Prepare GST Return' },
      description: { type: 'string', example: 'Need GST filing for July' },
      priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'HIGH', example: 'HIGH' },
      dueDate: { type: 'string', format: 'date', example: '2026-08-15' },
    },
  },
  UploadClientDocumentRequest: {
    type: 'object',
    required: ['fileName', 'fileUrl'],
    properties: {
      fileName: { type: 'string', example: 'Sales_Invoice_Jul2026.pdf' },
      fileUrl: { type: 'string', example: 'https://storage.auditee.com/docs/sales_jul2026.pdf' },
      fileType: { type: 'string', example: 'application/pdf' },
      fileSize: { type: 'integer', example: 524288 },
    },
  },
};

const publicClientPaths = {
  '/api/client/dashboard': {
    get: {
      summary: 'Client Dashboard Metrics',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Client dashboard metrics fetched successfully' },
      },
    },
  },
  '/api/client/profile': {
    get: {
      summary: 'Get Client Profile',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Client profile fetched successfully' },
      },
    },
    put: {
      summary: 'Update Client Profile',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClientProfileRequest' } } },
      },
      responses: {
        200: { description: 'Client profile updated successfully' },
      },
    },
  },
  '/api/client/my-user': {
    get: {
      summary: 'Get Assigned Employee Users for Client',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Assigned users fetched successfully' },
      },
    },
  },
  '/api/client/tasks': {
    post: {
      summary: 'Create Work Request',
      description: 'Creates a Task automatically assigned to the Client\'s assigned primary User and firm.',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateWorkRequest' } } },
      },
      responses: {
        201: { description: 'Work request task created successfully' },
      },
    },
    get: {
      summary: 'View My Tasks',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Client tasks fetched successfully' },
      },
    },
  },
  '/api/client/tasks/{taskId}': {
    get: {
      summary: 'Get Client Task Details',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Task details fetched successfully' },
        403: { description: 'Access denied' },
        404: { description: 'Task not found' },
      },
    },
  },
  '/api/client/tasks/{taskId}/documents': {
    post: {
      summary: 'Upload Documents to Task',
      tags: ['Public Client'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadClientDocumentRequest' } } },
      },
      responses: {
        201: { description: 'Document uploaded successfully' },
      },
    },
  },
};

module.exports = { publicClientSchemas, publicClientPaths };
