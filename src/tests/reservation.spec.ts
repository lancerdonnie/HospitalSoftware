import app from '../app';
import request from 'supertest';
import { closeConn } from '../createConn';
import { createConnection } from 'typeorm';
import { Reservation, RoomType, Status } from '../entity/Reservation';

const agent = request(app);

describe('Reservation Test', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Reservation],
      synchronize: true,
      logging: false,
    });
    await Reservation.insert({
      reservation_id: 5,
      room_type: RoomType.REGULAR,
      customer_id: 12345,
      amount_paid: 25000,
      status: Status.PAID,
      checking_time: '2021-02-22T16:01:00.000Z',
      checkout_time: '2021-02-23T16:01:00.000Z',
    });
  });

  afterAll(async () => {
    await closeConn();
  });

  test('empty object gives error', async (done) => {
    await agent
      .post('/reservation')
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('"reservation_id" is required');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('customer_id is provided', async (done) => {
    await agent
      .post('/reservation')
      .send({
        reservation_id: 5,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('"customer_id" is required');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('reservation is not added twice', async (done) => {
    await agent
      .post('/reservation')
      .send({
        reservation_id: 5,
        room_type: RoomType.REGULAR,
        customer_id: 12345,
        amount_paid: 25000,
        status: Status.PAID,
        checking_time: '2021-02-22T16:01:00.000Z',
        checkout_time: '2021-02-23T16:01:00.000Z',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('Reservation with that id already exists');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('reservation is successfully added', async (done) => {
    await agent
      .post('/reservation')
      .send({
        reservation_id: 2,
        room_type: RoomType.REGULAR,
        customer_id: 12345,
        amount_paid: 25000,
        status: Status.OUTSTANDING,
        checking_time: '2021-02-22T16:01:00.000Z',
        checkout_time: '2021-02-23T16:01:00.000Z',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.reservation_id).toEqual(2);
      });
    done();
  });

  test('reservation is successfully updated', async (done) => {
    await agent
      .put('/reservation')
      .send({
        reservation_id: 2,
        room_type: RoomType.REGULAR,
        customer_id: 12345,
        amount_paid: 25000,
        status: Status.PAID,
        checking_time: '2021-02-22T16:01:00.000Z',
        checkout_time: '2021-02-23T16:01:00.000Z',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.status).toEqual(Status.PAID);
      });
    done();
  });

  test('reservation is successfully deleted', async (done) => {
    await agent
      .delete('/reservation/2')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('can get single reservation', async (done) => {
    await agent
      .get('/reservation/5')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('amount_paid');
      });
    done();
  });

  test('can get all reservations', async (done) => {
    await agent
      .get('/reservation')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveLength(1);
      });
    done();
  });
});
