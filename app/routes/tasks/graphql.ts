import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks(
    $embassy_id: String!
    $status: String
    $priority: String
    $assigned_to: String
    $created_by: String
    $is_urgent: Boolean
    $limit: Float
    $page: Float
  ) {
    tasks(
      embassy_id: $embassy_id
      status: $status
      priority: $priority
      assigned_to: $assigned_to
      created_by: $created_by
      is_urgent: $is_urgent
      limit: $limit
      page: $page
    ) {
      id
      embassy_id
      title
      description
      assigned_to
      status
      priority
      is_urgent
      due_date
      completed_at
      created_at
      updated_at
    }
  }
`;
