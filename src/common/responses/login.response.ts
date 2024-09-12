import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // This decorator marks the class as a GraphQL Object Type
export class LoginResponse {
  @Field(() => String, {
    description: 'JWT Token issued to the user for making protected requests',
  })
  token: string;
}
