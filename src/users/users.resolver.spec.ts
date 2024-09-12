import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PrismaService } from 'prisma/prisma.client';
import { JwtService } from 'src/common/services';
import { ConfigModule } from '@nestjs/config';

describe('UserResolver', () => {
  let resolver: UsersResolver;
  let usersService: Partial<UsersService>;
  // let authService: Partial<AuthService>;

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
        // {
        //   provide: AuthService,
        //   useValue: {
        //     validateUser: jest.fn(),
        //     signJwtToken: jest.fn(),
        //   },
        // },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
    // authService = module.get<AuthService>(AuthService);
  });

  // Test: Missing email or password in registration
  it('should throw BadRequestException if email or password is missing during registration', async () => {
    // const email = 'test@example.com';
    // const password = 'testPassword';
    // const hashedPassword = 'hashedPassword';
    // const mockUser = {
    //   email,
    //   password: hashedPassword,
    // };

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
