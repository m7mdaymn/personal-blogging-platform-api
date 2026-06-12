import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { swaggerDefinition } from '../docs/swagger';

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
};
