import { readFileSync } from 'node:fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { DATA_LAYER, ping } from './db/index.js';
import { errorHandler, notFoundRoute } from './middlewares/error-handler.js';
import { router } from './routes/index.js';

const openapi = YAML.parse(readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));

export const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  res.json({ status: 'ok', ...(await ping()) });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
// Lab: endpoint ALP tim (Sequelize). Dimuat hanya di lapisan orm supaya lapisan sql tidak ikut memuat Sequelize.
if (DATA_LAYER === 'orm') {
  const { alpRouter } = await import('./alp/router.js');
  app.use('/api/alp', alpRouter);
}
app.use('/api', router);

app.use(notFoundRoute);
app.use(errorHandler);
