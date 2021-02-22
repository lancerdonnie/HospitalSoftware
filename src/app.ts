import express, { json } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { createConn } from './createConn';

// Controllers

const app = express();

app.use(json());
app.use(cors());

(async () => {
  await createConn();
})();

export default app;
