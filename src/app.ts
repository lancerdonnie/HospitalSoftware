import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { createConn } from './createConn';

// Controllers
import ReservationController from './controllers/ReservationController';
import OverstayController from './controllers/OverstayController';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/reservation', ReservationController);
app.use(OverstayController);

(async () => {
  await createConn();
})();

export default app;
