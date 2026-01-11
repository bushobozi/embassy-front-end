import { gql } from "@apollo/client";

export const GET_INFORMATION_BOARDS = gql`
  query GetInformationBoards(
    $embassy_id: String!
    $is_active: Boolean
    $page: Float
    $limit: Float
  ) {
    informationBoards(
      embassy_id: $embassy_id
      is_active: $is_active
      page: $page
      limit: $limit
    ) {
      id
      title
      category
      image
      attachments
      description
      is_active
      location
      embassy_id
      embassy_name
      embassy_picture
      created_by
      created_at
      updated_at
    }
  }
`;
