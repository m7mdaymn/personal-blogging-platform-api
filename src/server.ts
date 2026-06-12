import app from './app';
import { env } from './config/env';

const start = (): void => {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`API docs available at http://localhost:${env.PORT}/api-docs`);
  });
};

start();
