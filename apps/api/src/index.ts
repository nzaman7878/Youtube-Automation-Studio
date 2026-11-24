import { app } from './app.js';
import { config } from './config.js';
import { logger } from './logger/index.js';

if (config.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    logger.info(
      `YT Automation Studio API server running on port ${config.PORT} [${config.NODE_ENV}]`,
    );
  });
}

export default app;
