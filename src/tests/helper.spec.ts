import { Reservation, RoomType, Status } from '../entity/Reservation';
import { calculateOverstayCost } from '../controllers/helper';
import { closeConn } from '../createConn';
import { createConnection } from 'typeorm';

describe('Overstay Cost Calculation', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Reservation],
      synchronize: true,
      logging: false,
    });
    await Reservation.insert([
      {
        reservation_id: 5,
        room_type: RoomType.REGULAR,
        customer_id: 12345,
        amount_paid: 25000,
        status: Status.PAID,
        checking_time: '2021-02-20 12:00:00',
        checkout_time: '2021-02-21 23:59:59',
      },
      {
        reservation_id: 2,
        room_type: RoomType.REGULAR,
        customer_id: 12345,
        amount_paid: 25000,
        status: Status.PAID,
        checking_time: '2021-02-22 12:00:00',
        checkout_time: '2021-02-23 23:59:59',
      },
    ]);
  });

  afterAll(async () => {
    await closeConn();
  });

  test('calculation works', async (done) => {
    const reservation = await Reservation.findOne(5);
    if (!reservation) return done();
    const result = calculateOverstayCost({
      overStayed_date: new Date('2021-02-22 12:00:00'),
      reservation,
    });
    expect(result).toHaveProperty('totalOverstayCost');
    expect(result.hoursOverstayed).toBe(13);
    done();
  });

  test('Weekend calculation works', async (done) => {
    const reservation = await Reservation.findOne(5);
    if (!reservation) return done();
    const result = calculateOverstayCost({
      overStayed_date: new Date('2021-02-22 01:00:00'),
      reservation,
    });
    expect(result).toHaveProperty('totalOverstayCost');
    expect(result.hoursOverstayed).toBe(2);
    done();
  });

  test('Weekday calculation works', async (done) => {
    const reservation = await Reservation.findOne(2);
    if (!reservation) return done();
    const result = calculateOverstayCost({
      overStayed_date: new Date('2021-02-24 01:00:00'),
      reservation,
    });
    expect(result).toHaveProperty('totalOverstayCost');
    expect(result.hoursOverstayed).toBe(2);
    done();
  });
});
