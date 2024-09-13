import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.client';
import { JwtService } from 'src/common/services';
import { ConfigModule } from '@nestjs/config';

describe('UserResolver', () => {
  let resolver: UsersResolver;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        UsersResolver,
        UsersService,
        PrismaService,
        JwtService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  // Test: Missing email or password in registration
  it('should throw BadRequestException if email or password is missing during registration', async () => {
    // create a "prisma.user.register" model mock function
    usersService.register = jest
      .fn()
      .mockImplementation(({ email, password }) => {
        if (!email || !password) {
          throw new BadRequestException('Invalid input');
        }
        return Promise.resolve(); // Successful registration for valid email
      });

    await expect(
      resolver.register({ email: '', password: '' }),
    ).rejects.toThrow(BadRequestException);
  });

  // // Test: Invalid email format
  it('should throw BadRequestException if email is invalid', async () => {
    usersService.register = jest.fn().mockImplementation(({ email }) => {
      if (email === 'invalidemail') {
        throw new BadRequestException('Invalid email');
      }
      return Promise.resolve(); // Successful registration for valid email
    });

    await expect(
      resolver.register({ email: 'invalidemail', password: 'password123' }),
    ).rejects.toThrow(BadRequestException);
  });
});
