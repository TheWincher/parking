import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpace } from './parking/parking-space.entity';
import { ParkingModule } from './parking/parking.module';

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
