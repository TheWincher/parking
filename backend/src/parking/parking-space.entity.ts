import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ParkingSpace {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: true})
    free: boolean;
}