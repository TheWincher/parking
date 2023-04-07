import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { ParkingSpace } from "./parking-space.entity";
import { ParkingService } from "./parking.service";
import { ParkingController } from "./parking.controller";
import { Repository } from "typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([ParkingSpace])],
    providers: [ParkingService],
    controllers: [ParkingController]
})
export class ParkingModule implements OnApplicationBootstrap {
    constructor(@InjectRepository(ParkingSpace) private parkingSpaceRepository: Repository<ParkingSpace>) {}

    async onApplicationBootstrap(): Promise<void> {
        var parkingSpaces: ParkingSpace[] = []; 
        for(var id = 0; id < 18; id++) {
            parkingSpaces.push({id: id, free: true});
        }

        await this.parkingSpaceRepository.save(parkingSpaces);
    }
}
