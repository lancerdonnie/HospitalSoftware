import {MigrationInterface, QueryRunner} from "typeorm";

export class newmigration1613996705846 implements MigrationInterface {
    name = 'newmigration1613996705846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `reservation` (`reservation_id` int NOT NULL AUTO_INCREMENT, `room_type` enum ('deluxe', 'regular', 'palatial') NOT NULL, `customer_id` int NOT NULL, `amount_paid` int NOT NULL, `status` enum ('paid', 'outstanding') NOT NULL, `checking_time` datetime NOT NULL, `checkout_time` datetime NOT NULL, `created_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`reservation_id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `reservation`");
    }

}
