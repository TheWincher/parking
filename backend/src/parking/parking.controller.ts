import { Controller, Get, Param } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingSpace } from './parking-space.entity';

@Controller('parking')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    @Get('/take')
    async take(): Promise<number | undefined> {
        return this.parkingService.take();
    }

    @Get('/leave/:id')
    async leave(@Param('id') id: number): Promise<void> {
        return this.parkingService.leave(id);
    }

    @Get('/all')
    async getAll(): Promise<ParkingSpace[]>  {
        return this.parkingService.getAll();
    }
}
