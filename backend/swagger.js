const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elokuvaprojekti API',
      version: '1.0.0',
      description: 'A full-stack application for movie discovery, social reviews, and group collaboration. Supports user registration, movie search, group management, and favorite lists.',
      contact: {
        name: 'OAMK Team',
        email: 'support@elokuvaprojekti.local',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
      {
        url: 'https://moviedb-eqgbbphehffnerf7.francecentral-01.azurewebsites.net',
        description: 'Production server (Azure App Service)',
      },
    ],
    components: {
      schemas: {
        Error400: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Invalid email format',
                  },
                  param: {
                    type: 'string',
                    example: 'email',
                  },
                },
              },
            },
          },
        },
        Error200: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
          },
        },
        Error401: {
          type: 'object',
          properties: {
            errors: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid email or password',
                },
              },
            },
          },
        },
        Error404: {
          type: 'object',
          properties: {
            errors: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Refresh token not found',
                },
              },
            },
          },
        },
        Error409: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Email already in use',
            },
          },
        },
        Error500: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Internal server error',
            },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
            },
            name: {
              type: 'string',
              example: 'Friday Movie Club',
            },
            ownerId: {
              type: 'string',
              example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for protected endpoints',
        },
      },
    },
  },
  apis: [
  './modules/**/*.js',
  './users/**/*.js'
],


};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
