import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ParkingSpace } from './parking-space.entity';
import { ParkingModule } from './parking.module';
import { HttpException } from '@nestjs/common';

describe('ParkingService', () => {
  let service: ParkingService;

  type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
  };

  const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findBy: jest.fn(),
    findOneBy: jest.fn()
  }));

  let repositoryMock: MockType<Repository<ParkingSpace>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ParkingModule, TypeOrmModule.forRoot({
        type: 'sqlite',
        database: "parkingDB",
        synchronize: true,
        entities: [ParkingSpace]
      })],
      providers: [ParkingService, { provide: getRepositoryToken(ParkingSpace), useValue: repositoryMockFactory }],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
    repositoryMock = module.get(getRepositoryToken(ParkingSpace))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('take', () => {
    it('take with parking spaces free', async () => {
      const result = 0;

      var parkingSpaces: ParkingSpace[] = [];
      for (var id = 0; id < 18; id++) {
        parkingSpaces.push({ id: id, free: true });
      }

      jest.spyOn(repositoryMock, 'findBy').mockImplementation(() => parkingSpaces);
      expect(service.take()).resolves.toBe(result);
    });

    it('take without parking spaces free', async () => {
      const result = undefined;

      jest.spyOn(repositoryMock, 'findBy').mockImplementation(() => []);
      expect(service.take()).resolves.toBe(result);
    })
  })

  describe('leave', () => {
    it('not free', async () => {
      const result = undefined;
      const parkingSpace: ParkingSpace = { id: 0, free: false };

      jest.spyOn(repositoryMock, 'findOneBy').mockImplementation(() => parkingSpace);
      expect(service.leave(0)).resolves.toBe(result);
    });

    it('leave free', async () => {
      const result = undefined;
      const parkingSpace: ParkingSpace = { id: 0, free: true };

      jest.spyOn(repositoryMock, 'findOneBy').mockImplementation(() => parkingSpace);
      const rejects = expect(service.leave(parkingSpace.id)).rejects;
      rejects.toThrow(HttpException);
      rejects.toThrow(`La place n°${parkingSpace.id} est déjà libre`);
    })

    it('leave non existing', async () => {
      const result = undefined;
      const id = 0;

      jest.spyOn(repositoryMock, 'findOneBy').mockImplementation(() => undefined);
      const rejects = expect(service.leave(id)).rejects;
      rejects.toThrow(HttpException);
      rejects.toThrow(`La place n°${id} n'existe pas`);
    })
  })
});
