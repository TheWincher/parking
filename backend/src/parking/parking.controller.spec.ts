import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingModule } from './parking.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ParkingSpace } from './parking-space.entity';
import { ParkingService } from './parking.service';
import { Repository } from 'typeorm';

describe('ParkingController', () => {
  let controller: ParkingController;

  type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
  };

  const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findBy: jest.fn(),
    // ...
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ParkingModule, TypeOrmModule.forRoot({
        type: 'sqlite',
        database: "parkingDB",
        synchronize: true,
        entities: [ParkingSpace]
      })],
      providers: [ParkingService, {provide: getRepositoryToken(ParkingSpace), useValue: repositoryMockFactory}],
      controllers: [ParkingController],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
