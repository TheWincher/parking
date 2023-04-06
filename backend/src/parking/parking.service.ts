import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParkingSpace } from './parking-space.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingService {
    constructor(@InjectRepository(ParkingSpace) private parkingSpaceRepository: Repository<ParkingSpace>) {}

    async take(): Promise<number | undefined> {
        var parkingSpaces = await this.parkingSpaceRepository.findBy({free: true});

        if(parkingSpaces.length > 0) {
            var parkingSpace = parkingSpaces[0];
            parkingSpace.free = false;
            await this.parkingSpaceRepository.save(parkingSpace);
            return parkingSpace.id;
        }
        
        return undefined;
    }

    async leave(id: number): Promise<void> {
        var parkingSpace = await this.parkingSpaceRepository.findOneBy({id: id});
        if(parkingSpace == undefined) {
            throw new HttpException(`Not found parking space with number ${id}`, HttpStatus.NOT_FOUND)
        } else if(parkingSpace.free) {
            throw new HttpException(`Nobody on parking space with number ${id}`, HttpStatus.BAD_REQUEST)
        }

        parkingSpace.free = true;
        this.parkingSpaceRepository.save(parkingSpace);
    }

    async getAll(): Promise<ParkingSpace[]> {
        return this.parkingSpaceRepository.find();
    }
}
