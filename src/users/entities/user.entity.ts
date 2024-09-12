import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType() // This decorator marks the class as a GraphQL Object Type
export class User {
  @Field(() => ID, { description: 'Unique Identifier of a User' }) // ID type for UUID
  id: string;

  @Field(() => String, { description: 'Email of the User' })
  email: string;

  @Field(() => String, { description: 'Biometric Key', nullable: true }) // Make the biometricKey nullable
  biometricKey?: string;

  @Field({ description: 'Date User was Created' })
  createdAt: Date;

  @Field({ description: 'Last Date User was Updated' })
  updatedAt: Date;
}
