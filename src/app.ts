/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './app/middlwares/globalErrorhandler';
import router from './app/routes';
import notFound from './app/middlwares/notFound';

const app: Application = express();

// parsers

app.use(express.json());
app.use(cors());
// application Routes

app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send('Hello World!');
};
app.get('/', test);

app.use(globalErrorHandler);

app.use(notFound)
export default app;
