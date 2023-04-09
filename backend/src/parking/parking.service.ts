import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParkingSpace } from './parking-space.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingService {
    constructor(@InjectRepository(ParkingSpace) private parkingSpaceRepository: Repository<ParkingSpace>) { }

    /**
     * Prend la première place libre et la rend occupée
     * @returns le numéro de la place libre, undefined si aucune place n'est libre 
     */
    async take(): Promise<number | undefined> {
        var parkingSpaces = await this.parkingSpaceRepository.findBy({ free: true });

        if (parkingSpaces.length > 0) {
            var parkingSpace = parkingSpaces[0];
            parkingSpace.free = false;
            await this.parkingSpaceRepository.save(parkingSpace);
            return parkingSpace.id;
        }

        return undefined;
    }

    /**
     * Libère une place de parking
     * @param id le numéro de la place a libérer
     * @throws 
     * HttpStatus.NOT_FOUND si aucune place ne correspond au numéro de place demandé
     * HttpStatus.BAD_REQUEST si la place est déjà libre
     */
    async leave(id: number): Promise<void> {
        var parkingSpace = await this.parkingSpaceRepository.findOneBy({ id: id });
        if (!parkingSpace) {
            throw new HttpException(`La place n°${id} n'existe pas`, HttpStatus.NOT_FOUND)
        } else if (parkingSpace.free) {
            throw new HttpException(`La place n°${id} est déjà libre`, HttpStatus.BAD_REQUEST)
        }

        parkingSpace.free = true;
        this.parkingSpaceRepository.save(parkingSpace);
    }

    /**
     * Récupère la liste de toutes les places de parking avec leur état
     * @returns la liste des places de parkings en base
     */
    async getAll(): Promise<ParkingSpace[]> {
        return this.parkingSpaceRepository.find();
    }
}
