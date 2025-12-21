import { FormField } from "./FormField";
import {
  PublicationStatus,
  publicationStatusLabels,
} from "../publicationtypes";

interface StatusSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <FormField label="Status" required>
      <select
        name="status"
        value={value}
        onChange={onChange}
        className="select w-full"
        required
      >
        <option value="">Select a status</option>
        {Object.entries(PublicationStatus).map(([key, value]) => (
          <option key={value} value={value}>
            {publicationStatusLabels[key]}
          </option>
        ))}
      </select>
    </FormField>
  );
}
