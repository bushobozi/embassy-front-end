import { gql } from "@apollo/client";

export const GET_EMBASSY_PUBLICATIONS = gql`
  query GetEmbassyPublications(
    $embassy_id: String!
    $page: Float
    $limit: Float
    $status: String
    $publication_type: String
  ) {
    publications(
      embassy_id: $embassy_id
      page: $page
      limit: $limit
      status: $status
      publication_type: $publication_type
    ) {
      id
      title
      content
      cover_image
      embassy_id
      embassy_name
      embassy_picture
      publication_type
      created_by
      created_at
      updated_at
      status
    }
  }
`;

export const GET_PUBLICATIONS = gql`
  query GetEmbassyPublications(
    $embassy_id: String!
    $page: Float
    $limit: Float
    $status: String
    $publication_type: String
  ) {
    publications(
      page: $page
      limit: $limit
      status: $status
      publication_type: $publication_type
      embassy_id: $embassy_id
    ) {
      id
      title
      content
      cover_image
      embassy_id
      embassy_name
      embassy_picture
      publication_type
      created_by
      created_at
      updated_at
      status
    }
  }
`;

