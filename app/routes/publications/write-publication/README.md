# Write Publications Module

This module has been refactored into smaller, maintainable components for easier debugging and testing.

## 📁 File Structure

```
write-publication/
├── components/              # Reusable UI components
│   ├── FormField.tsx       # Generic form field wrapper with label and error display
│   ├── TitleInput.tsx      # Title input field
│   ├── PublicationTypeSelect.tsx  # Publication type dropdown
│   ├── TagsSelect.tsx      # Tags dropdown
│   ├── StatusSelect.tsx    # Status dropdown
│   ├── CoverImageUpload.tsx # Image upload with preview
│   ├── ContentEditor.tsx   # TinyMCE editor wrapper
│   ├── AlertMessage.tsx    # Success/error message display
│   └── index.ts            # Component exports
│
├── hooks/                   # Custom React hooks
│   ├── usePublicationForm.ts    # Form state and validation logic
│   ├── usePublicationSubmit.ts  # API submission logic
│   └── index.ts                 # Hook exports
│
├── formvalidators.ts       # Validation functions
├── publicationtypes.ts     # Type definitions and constants
├── layout.tsx              # Layout wrapper
└── write-publications.tsx  # Main component (orchestrator)

```

## 🎯 Component Responsibilities

### Main Component (`write-publications.tsx`)

- **Role**: Orchestrator - coordinates between components and hooks
- **Size**: ~150 lines (reduced from ~400 lines)
- **Responsibilities**:
  - Renders the form layout
  - Handles form submission
  - Manages editor ref
  - Coordinates form reset

### Components Directory

#### `FormField.tsx`

- Generic wrapper for form inputs
- Handles label, required/optional indicators, and error messages
- Reusable across different form fields

#### `TitleInput.tsx`

- Title input field with validation
- Self-contained with its own logic

#### `PublicationTypeSelect.tsx`

- Publication type dropdown
- Contains type options and labels

#### `TagsSelect.tsx`

- Tags dropdown selector

#### `StatusSelect.tsx`

- Status dropdown selector

#### `CoverImageUpload.tsx`

- File input for cover image
- Image preview functionality
- Error display

#### `ContentEditor.tsx`

- TinyMCE editor wrapper
- Editor configuration
- Validation integration

#### `AlertMessage.tsx`

- Success/error message display
- Styling based on message type

### Hooks Directory

#### `usePublicationForm.ts`

- **Responsibilities**:
  - Form state management
  - Field validation (on blur, on change)
  - Image preview handling
  - Form reset functionality
- **Returns**: Form data, errors, handlers, validation functions

#### `usePublicationSubmit.ts`

- **Responsibilities**:
  - API submission logic
  - Authentication token handling
  - Loading state management
  - Success/error message handling
- **Returns**: Submission state, submit function, message state

## 🔧 Benefits of This Structure

### 1. **Easier Debugging**

- Each component has a single responsibility
- Issues can be isolated to specific files
- Smaller files are easier to understand

### 2. **Better Testing**

- Components can be tested independently
- Hooks can be tested in isolation
- Mocking is simpler

### 3. **Improved Reusability**

- Form components can be reused in other forms
- Hooks can be used in different contexts
- Validation logic is centralized

### 4. **Better Maintainability**

- Clear separation of concerns
- Changes to one component don't affect others
- Easy to add new features

### 5. **Enhanced Developer Experience**

- Faster file navigation
- Better IDE performance with smaller files
- Clearer code organization

## 🚀 Usage Example

```tsx
// Main component is now simple and declarative
export default function WritePublications() {
  const editorRef = useRef<any>(null);

  // Form logic in custom hook
  const {
    formData,
    errors,
    touched,
    // ... handlers
  } = usePublicationForm();

  // Submission logic in separate hook
  const { isSubmitting, submitMessage, submitPublication } =
    usePublicationSubmit();

  // Component just orchestrates
  return (
    <form onSubmit={handleSubmit}>
      <TitleInput {...titleProps} />
      <PublicationTypeSelect {...typeProps} />
      {/* ... other components */}
    </form>
  );
}
```

## 🔍 Debugging Tips

1. **Form Validation Issues**: Check `usePublicationForm.ts` and `formvalidators.ts`
2. **API Submission Problems**: Check `usePublicationSubmit.ts`
3. **UI Rendering Issues**: Check individual component files
4. **Field-Specific Bugs**: Look at the corresponding component (e.g., `TitleInput.tsx` for title issues)

## 📝 Adding New Fields

To add a new form field:

1. Create a new component in `components/` directory
2. Add validation function in `formvalidators.ts`
3. Update `PublicationFormData` type in `publicationtypes.ts`
4. Add field to `usePublicationForm.ts` hook
5. Import and use component in `write-publications.tsx`

## ✅ No Functionality Lost

All original functionality is preserved:

- ✅ Form validation (title, content, status, publication type)
- ✅ Real-time validation on blur
- ✅ Image upload with preview
- ✅ File size and type validation
- ✅ API submission with authentication
- ✅ Success/error messaging
- ✅ Form reset functionality
- ✅ Required field indicators
