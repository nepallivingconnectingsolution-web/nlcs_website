/* Hand-authored OpenAPI 3.0 spec for the NLCITS API.
   Served interactively at GET /api/docs (Swagger UI) and as raw JSON at
   GET /api/openapi.json. Kept as a plain object (not jsdoc-generated) so it
   never silently drifts out of sync with a comment block. */

const bearer = { bearerAuth: [] };

const errorSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string' },
  },
};

export default {
  openapi: '3.0.3',
  info: {
    title: 'NLCITS API',
    version: '1.0.0',
    description:
      'REST API for Nepal Living Connecting IT Solution (NLCITS) Pvt. Ltd. — public content endpoints plus a JWT-protected admin surface.',
  },
  servers: [{ url: '/api', description: 'Relative to the deployed origin' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: { Error: errorSchema },
  },
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Contacts' },
    { name: 'Services' },
    { name: 'Projects' },
    { name: 'Testimonials' },
    { name: 'Newsletter' },
    { name: 'Users' },
    { name: 'Dashboard' },
    { name: 'Uploads' },
  ],
  paths: {
    '/health': {
      get: { tags: ['Health'], summary: 'Health check', responses: { 200: { description: 'OK' } } },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'JWT + profile' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current admin profile',
        security: [bearer],
        responses: { 200: { description: 'Profile' } },
      },
    },
    '/contacts': {
      post: {
        tags: ['Contacts'],
        summary: 'Submit a public enquiry',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 201: { description: 'Created' }, 422: { description: 'Validation failed' } },
      },
      get: {
        tags: ['Contacts'],
        summary: 'List enquiries',
        security: [bearer],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Paginated list' } },
      },
    },
    '/contacts/{id}': {
      patch: {
        tags: ['Contacts'],
        summary: 'Update enquiry status',
        security: [bearer],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Contacts'],
        summary: 'Delete an enquiry',
        security: [bearer],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/services': {
      get: { tags: ['Services'], summary: 'List active services', responses: { 200: { description: 'List' } } },
      post: {
        tags: ['Services'],
        summary: 'Create a service',
        security: [bearer],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/services/{slug}': {
      get: {
        tags: ['Services'],
        summary: 'Get a service by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service' }, 404: { description: 'Not found' } },
      },
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List active projects',
        parameters: [
          { name: 'featured', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List' } },
      },
      post: {
        tags: ['Projects'],
        summary: 'Create a project',
        security: [bearer],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/testimonials': {
      get: {
        tags: ['Testimonials'],
        summary: 'List active testimonials',
        parameters: [{ name: 'featured', in: 'query', schema: { type: 'string' } }],
        responses: { 200: { description: 'List' } },
      },
      post: {
        tags: ['Testimonials'],
        summary: 'Create a testimonial',
        security: [bearer],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/newsletter': {
      post: {
        tags: ['Newsletter'],
        summary: 'Subscribe an email',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } } } } },
        },
        responses: { 201: { description: 'Subscribed' } },
      },
      get: {
        tags: ['Newsletter'],
        summary: 'List subscribers',
        security: [bearer],
        responses: { 200: { description: 'Paginated list' } },
      },
    },
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Totals + recent enquiries',
        security: [bearer],
        responses: { 200: { description: 'Stats' } },
      },
    },
    '/dashboard/analytics': {
      get: {
        tags: ['Dashboard'],
        summary: 'Enquiries per day + by requested service',
        security: [bearer],
        parameters: [{ name: 'days', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Analytics' } },
      },
    },
    '/uploads': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload + optimize an image (multipart/form-data, field "image")',
        security: [bearer],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } },
            },
          },
        },
        responses: { 201: { description: 'Returns { url }' }, 400: { description: 'Invalid file' } },
      },
    },
  },
};
