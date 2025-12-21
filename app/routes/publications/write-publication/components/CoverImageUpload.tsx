import { FormField } from "./FormField";

interface CoverImageUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  preview: string | null;
}

export function CoverImageUpload({
  onChange,
  error,
  preview,
}: CoverImageUploadProps) {
  return (
    <FormField
      label="Cover Image"
      optional
      hint="Max 10MB, Recommended: 800x600px"
      error={error}
      touched={!!error}
    >
      <input
        type="file"
        id="cover_image"
        name="cover_image"
        onChange={onChange}
        className={`file-input w-full ${error ? "border-red-500" : ""}`}
        accept="image/*"
      />
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Cover preview"
            className="max-w-xs rounded border"
          />
        </div>
      )}
    </FormField>
  );
}
