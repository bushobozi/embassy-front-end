import { FormField } from "./FormField";
import { PublicationTypes, publicationTypeLabels } from "../publicationtypes";

interface PublicationTypeSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PublicationTypeSelect({
  value,
  onChange,
}: PublicationTypeSelectProps) {
  return (
    <FormField label="Publication Type" required>
      <select
        name="publication_type"
        value={value}
        onChange={onChange}
        className="select w-full"
        required
      >
        {Object.entries(PublicationTypes).map(([key, value]) => (
          <option key={value} value={value}>
            {publicationTypeLabels[key]}
          </option>
        ))}
      </select>
    </FormField>
  );
}
