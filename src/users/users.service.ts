import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginBiometricInput, LoginInput, RegisterUserInput } from './dto';
import { User } from './entities/user.entity';
import { GenericResponse, LoginResponse } from 'src/common/responses';
import { PrismaService } from 'prisma/prisma.client';
import { JwtService } from 'src/common/services';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async register(registerUserInput: RegisterUserInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerUserInput.email },
    });

    // Check if there is a user with the email on the db
    if (existingUser)
      throw new ConflictException('User with Email Already Exist!');

    return await this.prisma.user.create({
      data: {
        email: registerUserInput.email,
        password: await this.hashVariable(registerUserInput.password),
      },
    });
  }

  public async login(input: LoginInput): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    // check if user's credentials is valid
    if (!user || !(await this.verifyHash(input.password, user.password)))
      throw new UnauthorizedException('Invalid Login credentials');

    return { token: this.jwtService.signToken(user.id) };
  }

  public async biometricLogin(
    input: LoginBiometricInput,
  ): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { biometricKey: input.biometricKey },
    });

    if (!user) throw new UnauthorizedException('Invalid Biometric');

    return { token: this.jwtService.signToken(user.id) };
  }

  public async addBiometric(
    input: LoginBiometricInput,
    userId: string,
  ): Promise<GenericResponse> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { biometricKey: input.biometricKey },
    });

    return { message: 'Biometric Added Successfully!' };
  }

  // Helper function to hash the password
  private async hashVariable(variable: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(variable, saltRounds);
  }

  // Helper function to verify the hash
  private async verifyHash(
    variable: string,
    hashedVariable: string,
  ): Promise<boolean> {
    return await bcrypt.compare(variable, hashedVariable);
  }
}
