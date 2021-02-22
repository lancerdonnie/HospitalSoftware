import type { IResponse, OverstayType, TypedRequest } from '../types';
import type { Response } from 'express';
import { Router } from 'express';
import { Reservation, Status } from '../entity/Reservation';
import { overstayReservation } from '../utils/validate';
import { calculateOverstayCost } from './helper';

const router = Router();

//get one overstay by reservation_id
router.get(
  '/overstay',
  overstayReservation,
  async (req: TypedRequest<OverstayType>, res: Response<IResponse>) => {
    try {
      const reservation = await Reservation.findOne(req.body.reservation_id);

      if (!reservation)
        return res.status(400).json({
          data: null,
          status: 'error',
          message: 'Reservation with that id does not exist',
        });

      const overStayed_date = new Date(req.body.overstayed_checkout_time);

      if (reservation.checkout_time >= overStayed_date) {
        return res.status(400).json({
          data: null,
          status: 'error',
          message: 'Customer checked out ontime',
        });
      }

      let { totalOverstayCost, hoursOverstayed, weekDays, weekends } = calculateOverstayCost({
        overStayed_date,
        reservation,
      });

      const data = {
        totalOverstayCost,
        balance: totalOverstayCost,
        hoursOverstayed,
        weekDays,
        weekends,
        reservation,
      };

      //if customer hasn't paid
      if (reservation.status !== Status.PAID) {
        data.balance += reservation.amount_paid;
      }

      res.status(200).json({
        data,
        status: 'success',
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        status: 'error',
        message: error,
      });
    }
  }
);

export default router;
