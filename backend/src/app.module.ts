import { TypeOrmModule } from "@nestjs/typeorm";
import { ParkingSpace } from "./parking/parking-space.entity";
import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ParkingModule } from "./parking/parking.module";
import { AppController } from "./app.controller";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: "parkingDB",
    synchronize: true,
    entities: [ParkingSpace]
  }), ParkingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
