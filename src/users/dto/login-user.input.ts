import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email address of User logging in' })
  @IsEmail({}, { message: 'Please Provide a Valid Email' })
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @Field(() => String, { description: 'Password of User Logging in' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
