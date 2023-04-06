import { TypeOrmModule } from "@nestjs/typeorm";
import { ParkingSpace } from "./parking/parking-space.entity";
import { AppService } from "../dist/app.service";
import { Module } from "@nestjs/common";

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
