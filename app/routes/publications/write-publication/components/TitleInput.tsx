import { FormField } from "./FormField";

interface TitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

export function TitleInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
}: TitleInputProps) {
  return (
    <FormField label="Title" required error={error} touched={touched}>
      <input
        type="text"
        name="title"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input w-full ${touched && error ? "border-red-500" : ""}`}
        placeholder="Enter publication title"
        required
      />
    </FormField>
  );
}
