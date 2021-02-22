import { createConnection } from 'typeorm';

export const createConn = async () => {
  try {
    await createConnection();
    console.log('Database Connected');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
