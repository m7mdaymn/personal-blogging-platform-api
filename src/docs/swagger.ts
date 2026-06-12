export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Personal Blogging Platform API',
    version: '1.0.0',
    description:
      'A robust, secure, and scalable RESTful API for a personal blogging platform built with Node.js, Express.js, TypeScript, and PostgreSQL.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe', minLength: 2, maxLength: 50 },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'StrongPass1!',
            minLength: 8,
            description:
              'Must contain uppercase, lowercase, number, and special character',
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', format: 'password', example: 'StrongPass1!' },
        },
      },
      CreatePostInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: {
            type: 'string',
            example: 'My First Blog Post',
            minLength: 3,
            maxLength: 150,
          },
          content: {
            type: 'string',
            example: 'This is the content of my first blog post. It must be at least 10 characters long.',
            minLength: 10,
            maxLength: 10000,
          },
        },
      },
      UpdatePostInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: {
            type: 'string',
            example: 'My Updated Blog Post',
            minLength: 3,
            maxLength: 150,
          },
          content: {
            type: 'string',
            example: 'This is the updated content of my blog post.',
            minLength: 10,
            maxLength: 10000,
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email format' },
              },
            },
          },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
        },
      },
      PostResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'string' },
          authorId: { type: 'string', format: 'uuid' },
          author: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Creates a new user account. Does not return a JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            user: { $ref: '#/components/schemas/UserResponse' },
                          },
                        },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  message: 'User created successfully',
                  data: {
                    user: {
                      id: '550e8400-e29b-41d4-a716-446655440000',
                      name: 'John Doe',
                      email: 'john@example.com',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                example: {
                  success: false,
                  errors: [
                    { field: 'email', message: 'Invalid email format' },
                  ],
                },
              },
            },
          },
          '409': {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Email already exists',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticates a user and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            user: { $ref: '#/components/schemas/UserResponse' },
                            token: {
                              type: 'string',
                              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  message: 'Login successful',
                  data: {
                    user: {
                      id: '550e8400-e29b-41d4-a716-446655440000',
                      name: 'John Doe',
                      email: 'john@example.com',
                    },
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Invalid email or password',
                },
              },
            },
          },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Get all posts',
        description: 'Returns all blog posts sorted by latest first. Public endpoint.',
        responses: {
          '200': {
            description: 'Posts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/PostResponse' },
                        },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  message: 'Posts retrieved successfully',
                  data: [
                    {
                      id: '660e8400-e29b-41d4-a716-446655440001',
                      title: 'My First Blog Post',
                      content: 'This is the content of my first blog post.',
                      authorId: '550e8400-e29b-41d4-a716-446655440000',
                      author: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'John Doe',
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      updatedAt: '2024-01-01T00:00:00.000Z',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Create a new post',
        description: 'Creates a new blog post. Requires authentication.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePostInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Post created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/PostResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'No token provided',
                },
              },
            },
          },
        },
      },
    },
    '/posts/{id}': {
      put: {
        tags: ['Posts'],
        summary: 'Update a post',
        description: 'Updates an existing blog post. Requires authentication and ownership.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Post ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePostInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Post updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/PostResponse' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'You do not have permission to update this post',
                },
              },
            },
          },
          '404': {
            description: 'Post not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Post not found',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Delete a post',
        description: 'Deletes a blog post. Requires authentication and ownership.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Post ID',
          },
        ],
        responses: {
          '200': {
            description: 'Post deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  message: 'Post deleted successfully',
                  data: null,
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'You do not have permission to delete this post',
                },
              },
            },
          },
          '404': {
            description: 'Post not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};
