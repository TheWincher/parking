import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { ParkingSpace } from './parking-space.entity';

describe('ParkingService', () => {
  let service: ParkingService;

  const mockParkingRepository = {
    findBy: jest.fn().mockImplementation((options : FindOptionsWhere<ParkingSpace>) => {
      var parkingSpaces: ParkingSpace[] = []; 
      for(var id = 0; id < 20; id++) {
          parkingSpaces.push({id: id, free: true});
      }

      return Promise.resolve(parkingSpaces);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService, {provide: getRepositoryToken(ParkingService), useValue: mockParkingRepository}],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('take', () => {
    it('take with parking spaces free', async () => {
      const result = 0;
      jest.spyOn(mockParkingRepository, 'findBy').mockImplementation((options : FindOptionsWhere<ParkingSpace>) => []);

      expect(await service.take()).toBe(undefined);
    })
  })
});
