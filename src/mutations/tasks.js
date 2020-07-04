import { gql } from "apollo-boost";

export const CREATE_TASK = gql`
  mutation createTask($title: String) {
    insert_tasks_one(object: { title: $title }) {
      id
      title
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: Int!) {
    delete_tasks_by_pk(id: $id) {
      id
      title
    }
  }
`;
