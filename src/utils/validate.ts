import type { TypedResponse } from '../types';
import Joi from 'joi';
import { Request, NextFunction } from 'express';

const reservationSchema = Joi.object({
  reservation_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  room_type: Joi.valid('deluxe', 'regular', 'palatial').required(),
  amount_paid: Joi.number().required(),
  status: Joi.valid('paid', 'outstanding').required(),
  checking_time: Joi.date().required(),
  checkout_time: Joi.date().required(),
});

export const validateReservation = (req: Request, res: TypedResponse, next: NextFunction) => {
  const { error } = reservationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      data: null,
      message: error.message,
      status: 'error',
    });
  }

  if (req.body.checkout_time < req.body.checking_time) {
    return res.status(400).json({
      data: null,
      message: 'Your checkout time should not be before checking time',
      status: 'error',
    });
  }

  return next();
};

const overstaySchema = Joi.object({
  reservation_id: Joi.number().required(),
  overstayed_checkout_time: Joi.date().required(),
});

export const overstayReservation = (req: Request, res: TypedResponse, next: NextFunction) => {
  const { error } = overstaySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      data: null,
      message: error.message,
      status: 'error',
    });
  }

  return next();
};
