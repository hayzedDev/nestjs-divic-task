// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import * as bcrypt from 'bcryptjs';
// import { PrismaService } from 'prisma/prisma.client';
// import { JwtService } from 'src/common/services';
// import { ConfigService } from '@nestjs/config';

// describe('UsersService', () => {
//   let service: UsersService;
//   let prisma: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UsersService, PrismaService, JwtService, ConfigService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     prisma = module.get<PrismaService>(PrismaService);
//   });

//   it('should register a user and hash the password', async () => {
//     const email = 'test@example.com';
//     const password = 'testPassword';
//     const hashedPassword = 'hashedPassword';
//     const mockUser = {
//       email,
//       password: hashedPassword,
//     };

//     // create a "bcrypt.hash" mock function
//     jest
//       .spyOn(bcrypt, 'hash')
//       .mockImplementationOnce(() => Promise.resolve(hashedPassword));

//     // create a "prisma.user.create" model mock function
//     prisma.user.create = jest.fn().mockReturnValueOnce(mockUser);

//     const result = await service.register({ email, password });
//     expect(result).toEqual(mockUser);
//     expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
//     expect(prisma.user.create).toHaveBeenCalledWith({
//       data: {
//         email,
//         password: hashedPassword,
//       },
//     });
//   });

//   it('should authenticate a user with valid credentials', async () => {
//     const email = 'test@example.com';
//     const password = 'testPassword';
//     const hashedPassword = 'hashedPassword';
//     const mockUser = { email, password: hashedPassword };

//     prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser);

//     jest
//       .spyOn(bcrypt, 'compare')
//       .mockImplementationOnce(() => Promise.resolve(true));

//     const result = await service.login({ email, password });
//     expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
//     expect(result).toBeTruthy();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.client';
import { JwtService } from 'src/common/services';
import { ConfigService } from '@nestjs/config';

jest.mock('prisma/prisma.client'); // Mocking PrismaService globally

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock, // Use the fully mocked PrismaService
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should register a user and hash the password', async () => {
    const email = 'test@example.com';
    const password = 'testPassword';
    const hashedPassword = 'hashedPassword';
    const mockUser = {
      email,
      password: hashedPassword,
    };

    // Mock bcrypt.hash to return the hashed password
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => Promise.resolve(hashedPassword));

    // Mock prisma.user.create to return a fake user
    prisma.user.create = jest.fn().mockResolvedValueOnce(mockUser);

    const result = await service.register({ email, password });

    expect(result).toEqual(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email,
        password: hashedPassword,
      },
    });
  });

  it('should authenticate a user with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'testPassword';
    const hashedPassword = 'hashedPassword';
    const mockUser = { email, password: hashedPassword };

    // Mock prisma.user.findUnique to return a user
    prisma.user.findUnique = jest.fn().mockResolvedValueOnce(mockUser);

    // Mock bcrypt.compare to return true (valid password)
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => Promise.resolve(true));

    const result = await service.login({ email, password });

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBeTruthy();
  });
});
