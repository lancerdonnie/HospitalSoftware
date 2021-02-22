import express, { json } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { createConn } from './createConn';

// Controllers
import ReservationController from './controllers/ReservationController';

const app = express();

app.use(json());
app.use(cors());
app.use('/reservation', ReservationController);

(async () => {
  await createConn();
})();

export default app;
