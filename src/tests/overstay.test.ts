import app from '../app';
import request from 'supertest';
import { closeConn } from '../createConn';
import { createConnection } from 'typeorm';
import { Reservation, RoomType, Status } from '../entity/Reservation';

const agent = request(app);

describe('Overstay Test', () => {
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
      .get('/overstay')
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('"reservation_id" is required');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('reservation_id is provided', async (done) => {
    await agent
      .get('/overstay')
      .send({
        overstayed_checkout_time: '2021-02-22T16:01:00.000Z',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('"reservation_id" is required');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('overstayed_checkout_time is provided', async (done) => {
    await agent
      .get('/overstay')
      .send({
        reservation_id: 5,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('"overstayed_checkout_time" is required');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('wrong reservation_id is provided', async (done) => {
    await agent
      .get('/overstay')
      .send({
        reservation_id: 1,
        overstayed_checkout_time: '2021-02-22T16:01:00.000Z',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('Reservation with that id does not exist');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('wrong reservation_id is provided', async (done) => {
    await agent
      .get('/overstay')
      .send({
        reservation_id: 5,
        overstayed_checkout_time: '2021-02-23T16:01:00.000Z',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('Customer checked out ontime');
        expect(res.body.status).toBe('error');
        expect(res.body.data).toBe(null);
      });
    done();
  });

  test('generates overstaycost 1', async (done) => {
    await agent
      .get('/overstay')
      .send({
        reservation_id: 5,
        overstayed_checkout_time: '2021-02-24T16:01:00.000Z',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.totalOverstayCost).toEqual(42000);
      });
    done();
  });

  test('generates overstaycost 2', async (done) => {
    await agent
      .get('/overstay')
      .send({
        reservation_id: 5,
        overstayed_checkout_time: '2021-02-23T17:01:00.000Z',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.totalOverstayCost).toEqual(1750);
      });
    done();
  });

  test('outstanding payment is added to balance', async (done) => {
    await Reservation.insert({
      reservation_id: 2,
      room_type: RoomType.REGULAR,
      customer_id: 12345,
      amount_paid: 25000,
      status: Status.OUTSTANDING,
      checking_time: '2021-02-22T16:01:00.000Z',
      checkout_time: '2021-02-23T16:01:00.000Z',
    });
    await agent
      .get('/overstay')
      .send({
        reservation_id: 2,
        overstayed_checkout_time: '2021-02-23T17:01:00.000Z',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.balance).toEqual(26750);
      });
    done();
  });
});
