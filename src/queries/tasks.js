import { gql } from "apollo-boost";

export const GET_ALL_TASKS = gql`
  query tasks {
    tasks {
      id
      title
    }
  }
`;
