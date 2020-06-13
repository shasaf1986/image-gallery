import { gql } from 'apollo-server-micro';

export default gql`
  query getPhotos($query: [String!]!, $operator: Operator, $page: Int) {
    photos(query: $query, operator: $operator, page: $page) {
      page {
        page
        pages
      }
      photos {
        src
        title
      }
    }
  }
`;
