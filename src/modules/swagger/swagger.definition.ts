import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Agent era API documentation',
    version: '0.0.1',
    description: 'This is a node express mongoose api in typescript',
    license: {
      name: 'MIT',
      url: 'https://github.com/mainonline',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
