import { gql } from 'apollo-boost';

export const GET_ALL_TASKS = gql`
  query tasks {
    tasks {
      id
      title
      tags {
        id
        name
      }
    }
  }
`;

export const GET_ALL_TAGS = gql`
  query tags {
    tags {
      id
      name
    }
  }
`;
