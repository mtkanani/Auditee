const userSchemas = {
  CreateUserRequest: {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
    properties: {
      firstName: { type: 'string', example: 'Rahul' },
      lastName: { type: 'string', example: 'Sharma' },
      email: { type: 'string', format: 'email', example: 'rahul.employee@auditee.com' },
      password: { type: 'string', format: 'password', example: 'Password@123' },
      phone: { type: 'string', example: '9876543210' },
      designation: { type: 'string', example: 'Auditor' },
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
      profileImage: { type: 'string', example: 'https://example.com/profile.jpg' },
      joiningDate: { type: 'string', format: 'date', example: '2026-01-15' },
    },
  },
  UpdateUserRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'Rahul' },
      lastName: { type: 'string', example: 'Verma' },
      email: { type: 'string', format: 'email', example: 'rahul.verma@auditee.com' },
      phone: { type: 'string', example: '9876543210' },
      designation: { type: 'string', example: 'Senior Auditor' },
      profileImage: { type: 'string', example: 'https://example.com/profile.jpg' },
      joiningDate: { type: 'string', format: 'date', example: '2026-01-15' },
    },
  },
  ChangeUserStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'INACTIVE' },
    },
  },
  ResetUserPasswordRequest: {
    type: 'object',
    required: ['password', 'confirmPassword'],
    properties: {
      password: { type: 'string', format: 'password', example: 'NewPassword@123' },
      confirmPassword: { type: 'string', format: 'password', example: 'NewPassword@123' },
    },
  },
};

const userPaths = {
  '/api/firm-admin/users': {
    post: {
      summary: 'Create Employee User',
      description: 'Firm Admin creates an employee (User) belonging to their firm.',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateUserRequest' },
          },
        },
      },
      responses: {
        201: { description: 'User created successfully' },
        400: { description: 'Validation error / Email already exists' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' },
      },
    },
    get: {
      summary: 'Get All Employee Users',
      description: 'Fetch list of employee users belonging to the firm with pagination, search, sorting, and filters.',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'createdAt' } },
        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] } },
        { name: 'designation', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Users fetched successfully' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        500: { description: 'Internal server error' },
      },
    },
  },
  '/api/firm-admin/users/{userId}': {
    get: {
      summary: 'Get User Details',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'User details fetched successfully' },
        404: { description: 'User not found' },
      },
    },
    put: {
      summary: 'Update User Details',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } },
      },
      responses: {
        200: { description: 'User updated successfully' },
        404: { description: 'User not found' },
      },
    },
    delete: {
      summary: 'Soft Delete User',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'User deleted successfully' },
        404: { description: 'User not found' },
      },
    },
  },
  '/api/firm-admin/users/{userId}/status': {
    patch: {
      summary: 'Change User Status',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangeUserStatusRequest' } } },
      },
      responses: {
        200: { description: 'User status updated successfully' },
        404: { description: 'User not found' },
      },
    },
  },
  '/api/firm-admin/users/{userId}/reset-password': {
    post: {
      summary: 'Reset User Password',
      tags: ['Firm Admin - Users'],
      security: [{ BearerAuth: [] }],
      parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetUserPasswordRequest' } } },
      },
      responses: {
        200: { description: 'User password reset successfully' },
        404: { description: 'User not found' },
      },
    },
  },
};

module.exports = { userSchemas, userPaths };
