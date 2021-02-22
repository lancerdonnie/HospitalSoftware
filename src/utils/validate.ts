import type { TypedResponse } from '../types';
import Joi from 'joi';
import { Request, NextFunction } from 'express';

const options = {
  errors: {
    wrap: {
      label: '',
    },
  },
};

const reservationSchema = Joi.object({
  reservation_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  room_type: Joi.valid('deluxe', 'regular', 'palatial').required(),
  amount_paid: Joi.number().required(),
  status: Joi.valid('paid', 'outstanding').required(),
  checking_time: Joi.date().required(),
  checkout_time: Joi.date().required(),
});

export default (req: Request, res: TypedResponse, next: NextFunction) => {
  // const { error } = reservationSchema.validate(req.body, options);
  const { error } = reservationSchema.validate(req.body);

  if (error) {
    console.log(error.details[0]);
    return res.status(400).json({
      data: null,
      message: error.message,
      status: 'error',
    });
  }

  next();
};
