import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // This decorator marks the class as a GraphQL Object Type
export class GenericResponse {
  @Field(() => String, {
    description: 'A Success message',
  })
  message: string;
}
