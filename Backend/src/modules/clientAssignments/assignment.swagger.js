const assignmentSchemas = {
  AssignClientRequest: {
    type: 'object',
    required: ['clientId', 'userId'],
    properties: {
      clientId: { type: 'integer', example: 1 },
      userId: { type: 'integer', example: 5 },
    },
  },
  ChangeAssignmentRequest: {
    type: 'object',
    properties: {
      userId: { type: 'integer', example: 6 },
      clientId: { type: 'integer', example: 2 },
    },
  },
};

const assignmentPaths = {
  '/api/firm-admin/client-assignments': {
    post: {
      summary: 'Assign Client to User',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignClientRequest' } } },
      },
      responses: {
        201: { description: 'Client assigned to user successfully' },
        400: { description: 'Bad Request / Already assigned' },
        404: { description: 'Client or User not found' },
      },
    },
    get: {
      summary: 'List All Client Assignments',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'Client assignments fetched successfully' },
      },
    },
  },
  '/api/firm-admin/users/{userId}/clients': {
    get: {
      summary: 'Get Clients Assigned to a User',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'User clients fetched successfully' },
        404: { description: 'User not found' },
      },
    },
  },
  '/api/firm-admin/clients/{clientId}/users': {
    get: {
      summary: 'Get Users Assigned to a Client',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'clientId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Client assigned users fetched successfully' },
        404: { description: 'Client not found' },
      },
    },
  },
  '/api/firm-admin/client-assignments/{assignmentId}': {
    delete: {
      summary: 'Remove Client Assignment',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'assignmentId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Client assignment removed successfully' },
        404: { description: 'Assignment not found' },
      },
    },
    patch: {
      summary: 'Change Client Assignment',
      tags: ['Firm Admin - Client Assignments'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'assignmentId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangeAssignmentRequest' } } },
      },
      responses: {
        200: { description: 'Client assignment updated successfully' },
        404: { description: 'Assignment or target record not found' },
      },
    },
  },
};

module.exports = { assignmentSchemas, assignmentPaths };
