import { gql } from 'apollo-boost';

export const CREATE_TASK_WITH_NEW_TAG = gql`
  mutation createTask($title: String, $tag: String) {
    insert_tasks_one(
      object: {
        title: $title
        task_tags: { data: { tag: { data: { name: $tag } } } }
      }
    ) {
      id
      title
      tags {
        id
        name
      }
    }
  }
`;

export const CREATE_TASK_WITH_EXISTING_TAG = gql`
  mutation createTask($title: String, $tag_id: Int) {
    insert_tasks_one(
      object: { title: $title, task_tags: { data: { tag_id: $tag_id } } }
    ) {
      id
      title
      tags {
        id
        name
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation createTask($title: String, $tag: String, $tag_id: Int) {
    insert_tasks_one(object: { title: $title }) {
      id
      title
      tags {
        id
        name
      }
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

export const EDIT_TASK = gql`
  mutation editTask($id: Int!, $title: String) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
      tags {
        id
        name
      }
    }
  }
`;
