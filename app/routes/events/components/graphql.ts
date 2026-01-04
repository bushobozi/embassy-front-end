import { gql } from "@apollo/client";

// GraphQL Query for fetching embassy events
export const GET_EMBASSY_EVENTS = gql`
  query GetEmbassyEvents($embassy_id: String!, $page: Float, $limit: Float) {
    events(embassy_id: $embassy_id, page: $page, limit: $limit) {
      id
      event_name
      event_image
      event_type
      event_cost
      is_paid
      is_active
      is_public
      is_virtual
      is_private
      event_start_date
      event_end_date
      event_location
      max_attendees
      event_description
      registration_deadline
      embassy_id
      created_at
      created_by
      updated_at
    }
  }
`;
