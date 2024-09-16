import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail,  IsString, Matches } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field(() => String, { description: 'Email address of the Registering User' })
  @IsEmail({}, { message: 'Please Provide a Valid Email' })
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @Field(() => String, { description: 'Password of the Registering User' })
  @IsString({ message: 'Please Provide a Password' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s).{8,25}$/, {
    message:
      'Password must be between 8 and 25 characters long and include at least one letter and one number',
  })
  password: string;
}
