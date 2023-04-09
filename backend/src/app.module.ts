import { TypeOrmModule } from "@nestjs/typeorm";
import { ParkingSpace } from "./parking/parking-space.entity";
import { Module } from "@nestjs/common";
import { ParkingModule } from "./parking/parking.module";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: "parkingDB",
    synchronize: true,
    entities: [ParkingSpace]
  }), ParkingModule],
})
export class AppModule { }
