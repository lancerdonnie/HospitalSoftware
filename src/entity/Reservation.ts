import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoomType {
  DELUXE = 'deluxe',
  REGULAR = 'regular',
  PALATIAL = 'palatial',
}

export enum Status {
  PAID = 'paid',
  OUTSTANDING = 'outstanding',
}

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column({ type: 'enum', enum: RoomType })
  room_type: RoomType;

  @Column()
  customer_id: number;

  @Column()
  amount_paid: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column()
  checking_time: Date;

  @Column()
  checkout_time: Date;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
