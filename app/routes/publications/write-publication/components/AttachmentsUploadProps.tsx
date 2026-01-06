interface AttachmentsUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  files?: File[];
}

export function AttachmentsUpload({ onChange, error, files }: AttachmentsUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Attachments
      </label>
      <input
        type="file"
        id="attachments"
        name="attachments"
        multiple
        onChange={onChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      {files && files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Selected files:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}