import { RoomType } from '../entity/Reservation';

export type OverstayCostType = {
  [key in RoomType]: {
    weekDayRate: number;
    weekendRate: number;
  };
};

const rate = 100;

export const overstayCost: OverstayCostType = {
  [RoomType.REGULAR]: {
    weekDayRate: 7 / rate,
    weekendRate: 10 / rate,
  },
  [RoomType.DELUXE]: {
    weekDayRate: 8.5 / rate,
    weekendRate: 12 / rate,
  },
  [RoomType.PALATIAL]: {
    weekDayRate: 11 / rate,
    weekendRate: 16 / rate,
  },
};
