import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { LoginBiometricInput, LoginInput, RegisterUserInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GenericResponse, LoginResponse } from 'src/common/responses';
import { AuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async register(
    @Args('createUserInput') createUserInput: RegisterUserInput,
  ): Promise<User> {
    return await this.usersService.register(createUserInput);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return await this.usersService.login(input);
  }

  @Mutation(() => LoginResponse)
  async biometricLogin(
    @Args('input') input: LoginBiometricInput,
  ): Promise<LoginResponse> {
    return await this.usersService.biometricLogin(input);
  }

  // Protected Mutation for user to add biometric
  @UseGuards(AuthGuard)
  @Mutation(() => GenericResponse)
  async addBiometric(
    @Args('input') input: LoginBiometricInput,
    @CurrentUser() user: User,
  ): Promise<GenericResponse> {
    return await this.usersService.addBiometric(input, user.id);
  }

  @Query(() => String)
  health(): string {
    return 'NestJs Backend App is Running!';
  }
}
