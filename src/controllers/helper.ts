import { Reservation } from '../entity/Reservation';
import { overstayCost } from '../utils/util';
import dayjs from 'dayjs';

export const calculateOverstayCost = ({
  overStayed_date,
  reservation,
}: {
  overStayed_date: Date;
  reservation: Reservation;
}) => {
  let fromCheckoutTime = dayjs(reservation.checkout_time);
  const hoursOverstayed = Math.ceil(dayjs(overStayed_date).diff(fromCheckoutTime, 'h', true));

  let totalOverstayCost: number = 0;
  let weekends: number = 0;
  let weekDays: number = 0;

  const weekendCost = reservation.amount_paid * overstayCost[reservation.room_type].weekendRate;
  const weekDayCost = reservation.amount_paid * overstayCost[reservation.room_type].weekDayRate;

  for (let i = 0; i < hoursOverstayed; i++) {
    //weekend
    if ([0, 6].includes(fromCheckoutTime.add(i, 'h').day())) {
      totalOverstayCost += weekendCost;
      weekends++;
    } else {
      //weekday
      totalOverstayCost += weekDayCost;
      weekDays++;
    }
  }

  return {
    hoursOverstayed,
    weekends,
    weekDays,
    totalOverstayCost: Number(Number(totalOverstayCost.toFixed(2))),
  };
};
