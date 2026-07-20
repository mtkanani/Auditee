const publicUserSchemas = {
  UpdateEmployeeProfileRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'Rahul' },
      lastName: { type: 'string', example: 'Sharma' },
      phone: { type: 'string', example: '9876543210' },
      city: { type: 'string', example: 'Mumbai' },
      profileImage: { type: 'string', example: 'https://example.com/photo.jpg' },
    },
  },
  UpdateTaskStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'IN_PROGRESS' },
    },
  },
  UploadDocumentRequest: {
    type: 'object',
    required: ['fileName', 'fileUrl'],
    properties: {
      fileName: { type: 'string', example: 'GST_Computation_Jul2026.pdf' },
      fileUrl: { type: 'string', example: 'https://storage.auditee.com/docs/gst_jul2026.pdf' },
      fileType: { type: 'string', example: 'application/pdf' },
      fileSize: { type: 'integer', example: 1048576 },
    },
  },
  CreateTimeEntryRequest: {
    type: 'object',
    required: ['hours'],
    properties: {
      hours: { type: 'number', example: 2.5 },
      description: { type: 'string', example: 'Reviewed GST input tax credit reconciliation' },
      date: { type: 'string', format: 'date', example: '2026-07-20' },
    },
  },
};

const publicUserPaths = {
  '/api/user/dashboard': {
    get: {
      summary: 'Employee Dashboard Metrics',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Employee dashboard summary fetched successfully' },
      },
    },
  },
  '/api/user/profile': {
    get: {
      summary: 'Get Employee Profile',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Profile fetched successfully' },
      },
    },
    put: {
      summary: 'Update Employee Profile',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateEmployeeProfileRequest' } } },
      },
      responses: {
        200: { description: 'Profile updated successfully' },
      },
    },
  },
  '/api/user/clients': {
    get: {
      summary: 'Get Assigned Clients',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'My assigned clients fetched successfully' },
      },
    },
  },
  '/api/user/tasks': {
    get: {
      summary: 'Get My Assigned Tasks',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] } },
        { name: 'priority', in: 'query', schema: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'My tasks fetched successfully' },
      },
    },
  },
  '/api/user/tasks/{taskId}': {
    get: {
      summary: 'Get Task Details',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Task details fetched successfully' },
        403: { description: 'Access denied' },
        404: { description: 'Task not found' },
      },
    },
  },
  '/api/user/tasks/{taskId}/status': {
    patch: {
      summary: 'Update Task Status',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTaskStatusRequest' } } },
      },
      responses: {
        200: { description: 'Task status updated successfully' },
      },
    },
  },
  '/api/user/tasks/{taskId}/documents': {
    post: {
      summary: 'Upload Document for Task',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadDocumentRequest' } } },
      },
      responses: {
        201: { description: 'Task document uploaded successfully' },
      },
    },
  },
  '/api/user/tasks/{taskId}/time-entry': {
    post: {
      summary: 'Log Time Entry for Task',
      tags: ['Public User (Employee)'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTimeEntryRequest' } } },
      },
      responses: {
        201: { description: 'Time entry logged successfully' },
      },
    },
  },
};

module.exports = { publicUserSchemas, publicUserPaths };
