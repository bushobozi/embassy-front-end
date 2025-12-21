import { FormField } from "./FormField";
import { PublicationTags, publicationTagLabels } from "../publicationtypes";

interface TagsSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function TagsSelect({ value, onChange }: TagsSelectProps) {
  return (
    <FormField label="Tags">
      <select
        name="tags"
        value={value}
        onChange={onChange}
        className="select w-full"
      >
        {Object.entries(PublicationTags).map(([key, value]) => (
          <option key={value} value={value}>
            {publicationTagLabels[key]}
          </option>
        ))}
      </select>
    </FormField>
  );
}
