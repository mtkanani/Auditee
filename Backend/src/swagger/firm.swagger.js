const firmSchemas = {
  CreateFirmRequest: {
    type: 'object',
    required: ['firm', 'firmAdmin'],
    properties: {
      firm: {
        type: 'object',
        required: ['firmName', 'email', 'phone'],
        properties: {
          firmName: { type: 'string', example: 'ABC & Associates', description: 'The official name of the firm.' },
          email: { type: 'string', format: 'email', example: 'contact@abc.com', description: 'Unique email address of the firm.' },
          phone: { type: 'string', example: '9876543210', description: 'Primary contact phone number of the firm.' },
          address: { type: 'string', example: 'Surat', description: 'Physical address of the firm.' },
          city: { type: 'string', example: 'Surat', description: 'City name.' },
          state: { type: 'string', example: 'Gujarat', description: 'State name.' },
          country: { type: 'string', example: 'India', description: 'Country name.' },
          pincode: { type: 'string', example: '395007', description: 'ZIP or Postal pin code.' },
        },
      },
      firmAdmin: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phone', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Raj', description: 'First name of the firm administrator.' },
          lastName: { type: 'string', example: 'Patel', description: 'Last name of the firm administrator.' },
          email: { type: 'string', format: 'email', example: 'raj@abc.com', description: 'Unique login email for the firm administrator.' },
          phone: { type: 'string', example: '9999999999', description: 'Contact phone number of the firm administrator.' },
          password: { type: 'string', format: 'password', example: 'Temp@123', description: 'Secure temporary password. Must contain at least 8 characters (lowercase, uppercase, digit, special character).' },
        },
      },
    },
  },
  CreateFirmSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Firm and Firm Admin created successfully.' },
      data: {
        type: 'object',
        properties: {
          firm: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              firmName: { type: 'string', example: 'ABC & Associates' },
              email: { type: 'string', example: 'contact@abc.com' },
              phone: { type: 'string', example: '9876543210' },
              address: { type: 'string', example: 'Surat' },
              city: { type: 'string', example: 'Surat' },
              state: { type: 'string', example: 'Gujarat' },
              country: { type: 'string', example: 'India' },
              pincode: { type: 'string', example: '395007' },
              status: { type: 'string', example: 'ACTIVE' },
              firmAdminId: { type: 'integer', example: 5 },
              createdAt: { type: 'string', format: 'date-time', example: '2026-07-16T10:00:00.000Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T10:00:00.000Z' },
            },
          },
          admin: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 5 },
              firstName: { type: 'string', example: 'Raj' },
              lastName: { type: 'string', example: 'Patel' },
              email: { type: 'string', example: 'raj@abc.com' },
              phone: { type: 'string', example: '9999999999' },
              role: { type: 'string', example: 'FIRM_ADMIN' },
            },
          },
        },
      },
    },
  },
  GetFirmsSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Firms retrieved successfully.' },
      pagination: {
        type: 'object',
        properties: {
          currentPage: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          totalRecords: { type: 'integer', example: 15 },
          totalPages: { type: 'integer', example: 2 },
        },
      },
      filters: {
        type: 'object',
        properties: {
          search: { type: 'string', nullable: true, example: 'ABC' },
          status: { type: 'string', nullable: true, example: 'ACTIVE' },
        },
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            firmName: { type: 'string', example: 'ABC & Associates' },
            email: { type: 'string', example: 'contact@abc.com' },
            phone: { type: 'string', example: '9876543210' },
            address: { type: 'string', example: 'Surat' },
            city: { type: 'string', example: 'Surat' },
            state: { type: 'string', example: 'Gujarat' },
            country: { type: 'string', example: 'India' },
            pincode: { type: 'string', example: '395007' },
            status: { type: 'string', example: 'ACTIVE' },
            firmAdminId: { type: 'integer', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            firmAdmin: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 5 },
                firstName: { type: 'string', example: 'Raj' },
                lastName: { type: 'string', example: 'Patel' },
                email: { type: 'string', example: 'raj@abc.com' },
                phone: { type: 'string', example: '9999999999' },
                role: { type: 'string', example: 'FIRM_ADMIN' },
              },
            },
          },
        },
      },
    },
  },
  GetFirmByIdSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Firm details retrieved successfully.' },
      data: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firmName: { type: 'string', example: 'ABC & Associates' },
          email: { type: 'string', example: 'contact@abc.com' },
          phone: { type: 'string', example: '9876543210' },
          address: { type: 'string', example: 'Surat' },
          city: { type: 'string', example: 'Surat' },
          state: { type: 'string', example: 'Gujarat' },
          country: { type: 'string', example: 'India' },
          pincode: { type: 'string', example: '395007' },
          status: { type: 'string', example: 'ACTIVE' },
          firmAdminId: { type: 'integer', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          firmAdmin: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 5 },
              firstName: { type: 'string', example: 'Raj' },
              lastName: { type: 'string', example: 'Patel' },
              email: { type: 'string', example: 'raj@abc.com' },
              phone: { type: 'string', example: '9999999999' },
              role: { type: 'string', example: 'FIRM_ADMIN' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
  UpdateFirmRequest: {
    type: 'object',
    properties: {
      firmName: { type: 'string', example: 'ABC & Associates Limited' },
      email: { type: 'string', format: 'email', example: 'billing@abc.com' },
      phone: { type: 'string', example: '9876540000' },
      address: { type: 'string', example: 'Vesu' },
      city: { type: 'string', example: 'Surat' },
      state: { type: 'string', example: 'Gujarat' },
      country: { type: 'string', example: 'India' },
      pincode: { type: 'string', example: '395007' },
    },
  },
  UpdateFirmAdminRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'Rajesh' },
      lastName: { type: 'string', example: 'Patel' },
      email: { type: 'string', format: 'email', example: 'rajesh@abc.com' },
      phone: { type: 'string', example: '9999998888' },
    },
  },
  ChangeFirmStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
    },
  },
  ResetFirmAdminPasswordRequest: {
    type: 'object',
    required: ['newPassword'],
    properties: {
      newPassword: { type: 'string', format: 'password', example: 'NewTemp@123', description: 'Must contain at least 8 characters (lowercase, uppercase, digit, special character).' },
    },
  },
};

const firmPaths = {
  '/api/admin/firms': {
    post: {
      summary: 'Create a new Firm and its Firm Admin user',
      description: 'Restricted to SUPER_ADMIN only. Creates both a Firm record and its corresponding admin user in a single database transaction, sends welcome login credentials via email, and returns details.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateFirmRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Firm and Firm Admin created successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateFirmSuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed or duplicate email address (Firm/User).',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        403: {
          description: 'Forbidden - Only SUPER_ADMIN is allowed to access.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
    get: {
      summary: 'Get list of firms with search, pagination, and status filters',
      description: 'Restricted to SUPER_ADMIN only. Returns a paginated list of active (non-soft-deleted) firms.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Current page number.',
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Number of records per page.',
        },
        {
          name: 'search',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Search string matching firmName, email, or phone.',
        },
        {
          name: 'status',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          description: 'Filter firms by status.',
        },
      ],
      responses: {
        200: {
          description: 'Firms list retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GetFirmsSuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed for parameters.',
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/admin/firms/{firmId}': {
    get: {
      summary: 'Get details of a specific Firm by ID',
      description: 'Restricted to SUPER_ADMIN only. Fetches details along with its Administrator user record.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      responses: {
        200: {
          description: 'Firm details retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GetFirmByIdSuccessResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
    put: {
      summary: 'Update Firm details',
      description: 'Restricted to SUPER_ADMIN only. Partially or fully updates the firm record.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateFirmRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Firm details updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Firm details updated successfully.' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      firmName: { type: 'string', example: 'ABC & Associates Limited' },
                      email: { type: 'string', example: 'billing@abc.com' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation failed or duplicate email address.',
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
    delete: {
      summary: 'Soft Delete a Firm',
      description: 'Restricted to SUPER_ADMIN only. Flags the firm as deleted, changes status to INACTIVE, and invalidates all active user sessions for that firm.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      responses: {
        200: {
          description: 'Firm soft deleted successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ActionSuccessResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/admin/firms/{firmId}/admin': {
    put: {
      summary: 'Update Firm Admin details',
      description: 'Restricted to SUPER_ADMIN only. Updates name, email, and phone of the administrator user associated with the firm.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateFirmAdminRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Firm Admin details updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Firm Admin details updated successfully.' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 5 },
                      firstName: { type: 'string', example: 'Rajesh' },
                      lastName: { type: 'string', example: 'Patel' },
                      email: { type: 'string', example: 'rajesh@abc.com' },
                      phone: { type: 'string', example: '9999998888' },
                      role: { type: 'string', example: 'FIRM_ADMIN' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation failed or duplicate email address.',
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm or Firm Admin not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/admin/firms/{firmId}/status': {
    patch: {
      summary: 'Change status of a Firm',
      description: 'Restricted to SUPER_ADMIN only. Updates firm status (ACTIVE, INACTIVE, SUSPENDED). If changed to non-ACTIVE, force logs out all users from that firm.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChangeFirmStatusRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Firm status changed successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Firm status updated to INACTIVE successfully.' },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation failed.',
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/admin/firms/{firmId}/admin/reset-password': {
    post: {
      summary: 'Reset password of Firm Admin user',
      description: 'Restricted to SUPER_ADMIN only. Resets password of the firm admin, hashes it, and destroys all active login sessions of this admin.',
      tags: ['Firm Management'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'firmId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'The Firm ID.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetFirmAdminPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ActionSuccessResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed or password too weak.',
        },
        401: {
          description: 'Unauthorized.',
        },
        403: {
          description: 'Forbidden.',
        },
        404: {
          description: 'Firm or admin user not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
};

module.exports = {
  firmSchemas,
  firmPaths,
};
