import type { IResponse, ReservationType, TypedRequest, TypedResponse } from '../types';
import type { Response, Request } from 'express';
import { Router } from 'express';
import { Reservation } from '../entity/Reservation';
import validate from '../utils/validate';

const router = Router();

router.get('/', async (_, res: TypedResponse) => {
  try {
    const reservations = await Reservation.find();

    res.json({
      status: 'success',
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error,
    });
  }
});

router.post('/', validate, async (req: TypedRequest<ReservationType>, res: Response<IResponse>) => {
  const reservation = await Reservation.findOne(req.body.reservation_id);

  if (reservation)
    return res.status(400).json({
      data: null,
      status: 'error',
      message: 'Reservation with that id already exists',
    });

  try {
    const reservation = await Reservation.create(req.body);

    await Reservation.save(reservation);

    res.status(201).json({
      data: reservation,
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error,
    });
  }
});

router.put('/', validate, async (req: TypedRequest<ReservationType>, res: Response<IResponse>) => {
  try {
    const reservation = await Reservation.findOne(req.body.reservation_id);

    if (!reservation)
      return res.status(400).json({
        data: null,
        status: 'error',
        message: 'Reservation with that id does not exist',
      });

    await Reservation.merge(req.body as any);
    await Reservation.save(reservation);

    res.status(201).json({
      data: reservation,
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error,
    });
  }
});

router.delete('/:id', async (req: Request, res: Response<IResponse>) => {
  if (!req.params.id)
    return res.status(400).json({
      data: null,
      status: 'error',
      message: 'Please provide reservation_id as parameter',
    });

  try {
    const reservation = await Reservation.findOne(req.params.id);

    if (!reservation)
      return res.status(400).json({
        data: null,
        status: 'error',
        message: 'Reservation with that id does not exist',
      });

    await Reservation.delete(req.params.id);

    res.status(200).json({
      data: null,
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error,
    });
  }
});

export default router;
