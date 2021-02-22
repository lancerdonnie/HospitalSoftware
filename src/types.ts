import type { Response, Request } from 'express';
import { RoomType, Status } from './entity/Reservation';

export interface IResponse {
  message?: string;
  status: 'success' | 'error';
  data: {} | null;
}

export type TypedResponse = Omit<Response, 'json'> & {
  json(data: IResponse): Response;
};

export interface TypedRequest<T> extends Request {
  body: T;
}

export type ReservationType = {
  reservation_id: number;
  room_type: RoomType;
  customer_id: number;
  amount_paid: number;
  status: Status;
  checking_time: Date;
  checkout_time: Date;
};

export type OverstayType = {
  reservation_id: number;
  overstayed_checkout_time: Date;
};
