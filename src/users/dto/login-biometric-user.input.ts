import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginBiometricInput {
  @Field(() => String, { description: 'Biometric of User logging in' })
  @IsNotEmpty({ message: 'Please Provide a Biometric for Login' })
  @IsString({ message: 'Biometric Must be a String' })
  biometricKey: string;
}
