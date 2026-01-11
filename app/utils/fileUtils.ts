/**
 * Convert a File object to base64 string
 * @param file - The file to convert
 * @returns Promise resolving to base64 string with data URI prefix
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert multiple files to base64 strings
 * @param files - Array of files to convert
 * @returns Promise resolving to array of base64 strings
 */
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(file => fileToBase64(file)));
};

/**
 * Get file size in a human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Boolean indicating if file type is valid
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.replace("/*", ""));
    }
    return file.type === type;
  });
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes
 * @returns Boolean indicating if file size is valid
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxBytes;
};
