import { GraphQLClient } from 'graphql-request'; // THIS FILE IS THE GENERATED FILE
import { getSdk } from '../../pages/api/generated/graphql';

export const graphqlClient = getSdk(new GraphQLClient('/api/graphql'));
