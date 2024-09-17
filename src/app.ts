import express from 'express';
import cors from 'cors';
import { initializeModels } from '../database/models';
import morgan from 'morgan';
import { corsOptions } from './config/corsConfig';
import dotenv from 'dotenv';
import setupSwagger from './config/swaggerConfig';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

dotenv.config();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use(errorMiddleware);

(async () => {
  try {
    await initializeModels();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

setupSwagger(app);

export default app;
