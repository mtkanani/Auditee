const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { firmSchemas, firmPaths } = require('../swagger/firm.swagger');
const { userSchemas, userPaths } = require('../modules/users/user.swagger');
const { clientSchemas, clientPaths } = require('../modules/clients/client.swagger');
const { assignmentSchemas, assignmentPaths } = require('../modules/clientAssignments/assignment.swagger');
const { publicUserSchemas, publicUserPaths } = require('../modules/publicUser/publicUser.swagger');
const { publicClientSchemas, publicClientPaths } = require('../modules/publicClient/publicClient.swagger');

// Explicit configuration definitions for Swagger OpenApi 3.0 specification
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auditee Backend API Documentation',
      version: '1.0.0',
      description: 'Production-ready Auditee multi-tenant SaaS API documentation including Firms, Employee Users, Clients, Client Assignments, Public User, and Public Client endpoints.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Local development server',
      },
      {
        url: 'https://auditee-backend.onrender.com',
        description: 'Production Render server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          description: 'Enter the session accessToken received during login.',
        },
      },
      schemas: {
        SendOtpRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address to send the verification OTP to.',
              example: 'user@example.com',
            },
          },
        },
        VerifyOtpRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address.',
              example: 'user@example.com',
            },
            otp: {
              type: 'string',
              minLength: 6,
              maxLength: 6,
              description: 'The 6-digit OTP code sent via email.',
              example: '123456',
            },
          },
        },
        StandardSuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'OTP sent successfully to your email.',
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'fail',
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email address format.',
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'fail',
            },
            message: {
              type: 'string',
              example: 'OTP has expired. Please request a new OTP.',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'mobileNumber', 'email', 'password', 'confirmPassword', 'city'],
          properties: {
            firstName: { type: 'string', example: 'Meet' },
            lastName: { type: 'string', example: 'Kanani' },
            mobileNumber: { type: 'string', example: '9876543210' },
            email: { type: 'string', format: 'email', example: 'meet@gmail.com' },
            password: { type: 'string', format: 'password', example: 'Password@123' },
            confirmPassword: { type: 'string', format: 'password', example: 'Password@123' },
            city: { type: 'string', example: 'Ahmedabad' },
            role: { type: 'string', enum: ['user', 'admin'], default: 'user', example: 'user' },
          },
        },
        RegisterSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User registered successfully' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'd6b9f291-a5e2-4639-b903-51bf12d45a90' },
                firstName: { type: 'string', example: 'Meet' },
                lastName: { type: 'string', example: 'Kanani' },
                email: { type: 'string', format: 'email', example: 'meet@gmail.com' },
                mobileNumber: { type: 'string', example: '9876543210' },
                city: { type: 'string', example: 'Ahmedabad' },
                role: { type: 'string', example: 'user' },
              },
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User registration email.', example: 'meet@gmail.com' },
            password: { type: 'string', format: 'password', description: 'User account password.', example: 'Password@123' },
          },
        },
        LoginSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', example: 'da7a64a0210f92b7c41f71df...' },
                refreshToken: { type: 'string', example: 'a98b2df87610fa29...6d8f2b71' },
                idToken: { type: 'string', example: 'c0b8f27612f0a9...98bf2df1' },
              },
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: 'd6b9f291-a5e2-4639-b903-51bf12d45a90' },
                firstName: { type: 'string', example: 'Meet' },
                lastName: { type: 'string', example: 'Kanani' },
                email: { type: 'string', format: 'email', example: 'meet@gmail.com' },
                role: { type: 'string', example: 'user' },
              },
            },
          },
        },
        GetAllUsersSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Users fetched successfully' },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                totalRecords: { type: 'integer', example: 125 },
                totalPages: { type: 'integer', example: 13 },
              },
            },
            filters: {
              type: 'object',
              properties: {
                search: { type: 'string', nullable: true, example: 'meet' },
                role: { type: 'string', nullable: true, example: 'user' },
              },
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'd6b9f291-a5e2-4639-b903-51bf12d45a90' },
                  firstName: { type: 'string', example: 'Meet' },
                  lastName: { type: 'string', example: 'Kanani' },
                  mobileNumber: { type: 'string', example: '9876543210' },
                  email: { type: 'string', format: 'email', example: 'meet@gmail.com' },
                  city: { type: 'string', example: 'Ahmedabad' },
                  role: { type: 'string', example: 'user' },
                  isVerified: { type: 'boolean', example: true },
                  createdAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00Z' },
                  updatedAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00Z' },
                },
              },
            },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['email', 'currentPassword', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User account email.', example: 'meet@gmail.com' },
            currentPassword: { type: 'string', description: 'User current password.', example: 'Password@123' },
            newPassword: { type: 'string', description: 'User new password.', example: 'NewPassword@123' },
          },
        },
        ActionSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully.' },
          },
        },
        ForgotPasswordSendOtpRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User account email to send reset code.', example: 'meet@gmail.com' },
          },
        },
        ForgotPasswordVerifyOtpRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User account email.', example: 'meet@gmail.com' },
            otp: { type: 'string', description: 'The 6-digit verification code.', example: '123456' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'newPassword', 'confirmPassword'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User account email.', example: 'meet@gmail.com' },
            newPassword: { type: 'string', description: 'User new password.', example: 'ResetPassword@123' },
            confirmPassword: { type: 'string', description: 'User new password confirmation.', example: 'ResetPassword@123' },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string', format: 'uuid', description: 'User account ID.', example: '550e8400-e29b-41d4-a716-446655440000' },
            firstName: { type: 'string', description: 'User first name (2-50 chars).', example: 'Meet' },
            lastName: { type: 'string', description: 'User last name (2-50 chars).', example: 'Kanani' },
            mobileNumber: { type: 'string', description: 'User 10-digit mobile number.', example: '9876543210' },
            city: { type: 'string', description: 'User city location (max 100 chars).', example: 'Ahmedabad' },
          },
        },
        UpdateProfileSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Profile updated successfully' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
                firstName: { type: 'string', example: 'Meet' },
                lastName: { type: 'string', example: 'Kanani' },
                mobileNumber: { type: 'string', example: '9876543210' },
                email: { type: 'string', format: 'email', example: 'meet@gmail.com' },
                city: { type: 'string', example: 'Ahmedabad' },
                role: { type: 'string', example: 'user' },
                isVerified: { type: 'boolean', example: true },
                updatedAt: { type: 'string', format: 'date-time', example: '2026-07-10T10:00:00.000Z' },
              },
            },
          },
        },
      },
    },
    paths: {
      '/api/auth/forgot-password/send-otp': {
        post: {
          summary: 'Forgot Password: Send OTP',
          description: 'Generates a random 6-digit OTP, deletes previous forgot password OTPs for the email, saves it to database, and sends it via email. Limited to 5 requests per hour.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ForgotPasswordSendOtpRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OTP sent successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ActionSuccessResponse',
                  },
                },
              },
            },
            404: {
              description: 'User not found.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            429: {
              description: 'Too many requests.',
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
      },
      '/api/auth/forgot-password/verify-otp': {
        post: {
          summary: 'Forgot Password: Verify OTP',
          description: 'Verifies the forgot password OTP code, checking for matches and expiration. Marks verified=true upon success.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ForgotPasswordVerifyOtpRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OTP verified successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ActionSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid or expired OTP.',
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
      },
      '/api/auth/forgot-password/reset-password': {
        post: {
          summary: 'Forgot Password: Reset Password',
          description: 'Resets the user password after validating that the OTP has been verified. Hashes new password and purges verification codes.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResetPasswordRequest',
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
              description: 'Bad Request (e.g. OTP not verified, passwords mismatch, new password same as old).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'User not found.',
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
      },
      '/api/auth/change-password': {
        post: {
          summary: 'Change User Password',
          description: 'Allows a registered user to modify their password after verifying their current password. The new password must satisfy security strength requirements and differ from the old password.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChangePasswordRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Password changed successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ActionSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Bad Request (e.g. current password incorrect, new password same as old password).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'User not found.',
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
      },
      '/api/users': {
        get: {
          summary: 'Get All Users',
          description: 'Fetches a list of registered users with support for pagination, search, role filtering, and custom sorting. Excludes user passwords.',
          tags: ['Users'],
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
              description: 'Case-insensitive search string matching firstName, lastName, email, mobileNumber, or city.',
            },
            {
              name: 'role',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['user', 'admin'] },
              description: 'Filter users by role.',
            },
            {
              name: 'sortBy',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['firstName', 'email', 'city', 'createdAt'], default: 'createdAt' },
              description: 'Sort user records by field.',
            },
            {
              name: 'sortOrder',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
              description: 'Order sorting direction.',
            },
          ],
          responses: {
            200: {
              description: 'Users list retrieved successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/GetAllUsersSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Validation failed for parameters.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'No users found matching query.',
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
      },
      '/api/users/update-profile': {
        put: {
          summary: 'Update User Profile',
          description: 'Updates allowed profile fields (firstName, lastName, mobileNumber, city) for a registered user. Restricted fields (email, role, password) will reject the update. Must be authorized with a valid active session access token.',
          tags: ['Users'],
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateProfileRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Profile updated successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UpdateProfileSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Bad Request (e.g. attempting to update email, password, role; mobile number duplicate; validation failed).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized (missing or invalid token, or trying to update another user\'s profile).',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'User not found.',
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
      },
      '/api/auth/login': {
        post: {
          summary: 'User Login',
          description: 'Authenticates a user via email and password, generates cryptographic Access, Refresh, and ID tokens, saves session details in PostgreSQL, and purges expired sessions.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Validation failed or missing fields.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Incorrect password / credentials.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'User not registered / not found.',
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
      },
      '/api/auth/register': {
        post: {
          summary: 'Register a new User',
          description: 'Validates request payload, checks email/mobile uniqueness, verifies OTP verified status, hashes password, saves user in PostgreSQL and deletes validation OTP.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RegisterSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Bad Request (e.g. Email/Mobile already registered, OTP not verified).',
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
      },
      '/api/auth/send-otp': {
        post: {
          summary: 'Generate and send OTP',
          description: 'Validates the email format, runs rate limit checks, generates a 6-digit OTP, deletes previous instances, saves it in PostgreSQL with 5 mins expiry, and sends it to the email.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendOtpRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OTP sent successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/StandardSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input parameters.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationErrorResponse',
                  },
                },
              },
            },
            429: {
              description: 'Spam rate limit reached (more than 5 requests per hour).',
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
      },
      '/api/auth/verify-otp': {
        post: {
          summary: 'Verify OTP code',
          description: 'Validates request payload, fetches OTP for email, checks for matches/expiry, flags otp as verified, and deletes older otp records.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerifyOtpRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OTP verified successfully.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/StandardSuccessResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid, incorrect, or expired OTP.',
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
      },
      '/api/account/delete/send-otp': {
        post: {
          summary: 'Delete Account: Request OTP',
          description: 'Validates target user email, triggers a secure random 6-digit OTP code, saves it with a 5-minute expiry in PostgreSQL, and sends the code to the user via Nodemailer. Limited to 5 OTP requests per hour.',
          tags: ['Account Management'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                      description: 'The email address associated with the account to be deleted.'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'OTP sent successfully.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'OTP sent successfully' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid input or validation error.',
            },
            404: {
              description: 'User account not found.',
            },
            429: {
              description: 'Rate limit exceeded (Max 5 OTP requests per hour).',
            },
            500: {
              description: 'Internal server error.'
            }
          }
        }
      },
      '/api/account/delete/verify-otp': {
        post: {
          summary: 'Delete Account: Verify OTP',
          description: 'Matches the 6-digit verification code sent to the email and validates its expiration. If correct, marks the OTP as verified.',
          tags: ['Account Management'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                      description: 'The email address associated with the account.'
                    },
                    otp: {
                      type: 'string',
                      example: '123456',
                      description: 'The 6-digit verification code.'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'OTP verified successfully.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'OTP verified successfully' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid, incorrect, or expired OTP code.',
            },
            500: {
              description: 'Internal server error.'
            }
          }
        }
      },
      '/api/account/delete': {
        delete: {
          summary: 'Delete Account: Confirm Deletion',
          description: 'Permanently deletes the user record from the database. Requires that the deletion OTP for the given email has already been successfully verified. Cascades to clear active user sessions and related database OTP records.',
          tags: ['Account Management'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                      description: 'The email address associated with the account to be deleted.'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Account deleted successfully.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Account deleted successfully' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Email verification using OTP is required prior to deletion.',
            },
            404: {
              description: 'User account not found.',
            },
            500: {
              description: 'Internal server error.'
            }
          }
        }
      },
    },
  },
  apis: [], // Paths are explicitly documented above
};

// Merge dynamically loaded swagger paths and schemas from all modules
Object.assign(options.definition.components.schemas, firmSchemas, userSchemas, clientSchemas, assignmentSchemas, publicUserSchemas, publicClientSchemas);
Object.assign(options.definition.paths, firmPaths, userPaths, clientPaths, assignmentPaths, publicUserPaths, publicClientPaths);

const swaggerSpec = swaggerJSDoc(options);

/**
 * Attaches the Swagger UI middleware to the Express application.
 * @param {Express} app The Express application instance.
 */
const setupSwagger = (app) => {
  const port = process.env.PORT || 5000;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📖 Swagger docs enabled at http://localhost:${port}/api-docs`);
};

module.exports = {
  setupSwagger,
};
