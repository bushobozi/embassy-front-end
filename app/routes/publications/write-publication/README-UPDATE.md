# Update Publication Component

## Overview

The `update-publication.tsx` component reuses all the components from `write-publications` to allow editing existing publications.

## Features

- Loads existing publication data from GraphQL
- Pre-fills form fields with current values
- Uses all the same validation and components as the create page
- Includes preview functionality
- Handles cover image updates

## Usage

### Add to Routes

Add the update route to your router configuration:

```typescript
{
  path: "/publications/update/:id",
  element: <UpdatePublication />,
}
```

### Navigate to Update Page

From any publication display:

```typescript
import { useNavigate } from "react-router";

const navigate = useNavigate();

// Navigate to update page
navigate(`/publications/update/${publicationId}`);
```

### Or add an edit button:

```tsx
<Button onClick={() => navigate(`/publications/update/${pub.id}`)}>Edit</Button>
```

## GraphQL Requirements

The component expects these GraphQL operations to be available in your backend:

### Query

```graphql
query GetPublication($id: ID!) {
  publication(id: $id) {
    id
    title
    content
    publicationType
    tags
    status
    coverImage {
      url
    }
  }
}
```

### Mutation

```graphql
mutation UpdatePublication(
  $id: ID!
  $title: String!
  $content: String!
  $publicationType: String!
  $tags: String!
  $status: String!
  $coverImage: Upload
) {
  updatePublication(
    id: $id
    title: $title
    content: $content
    publicationType: $publicationType
    tags: $tags
    status: $status
    coverImage: $coverImage
  ) {
    publication {
      id
      title
      # ... other fields
    }
    success
    message
  }
}
```

## Components Reused

All components from the write-publications folder:

- TitleInput
- PublicationTypeSelect
- TagsSelect
- StatusSelect
- CoverImageUpload
- ContentEditor
- AlertMessage
- Preview

## Key Differences from Create Page

1. Loads existing data on mount
2. Button text says "Update" instead of "Create"
3. Cancel button navigates back instead of clearing form
4. Redirects to view page after successful update
5. Uses UPDATE_PUBLICATION mutation instead of CREATE
