import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Page {
    page: Int!
    pages: Int!
  }

  type Photo {
    src: String!
    title: String!
  }

  type Photos {
    page: Page!
    photos: [Photo!]!
  }

  type Query {
    photos(query: [String!]!, perPage: Int, page: Int): Photos!
  }
`;
