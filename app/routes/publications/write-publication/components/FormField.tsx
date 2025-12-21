interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  required = false,
  optional = false,
  hint,
  error,
  touched = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="label block mb-2">
        {label} {required && "*"}
        {(required || optional) && (
          <span className="text-xs text-gray-500 ml-2 font-normal">
            ({required ? "Required" : "Optional"}
            {hint && ` - ${hint}`})
          </span>
        )}
      </label>
      {children}
      {touched && error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
