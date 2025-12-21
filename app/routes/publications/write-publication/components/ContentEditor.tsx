import { useEffect, useRef, useState } from "react";
import { FormField } from "./FormField";

interface ContentEditorProps {
  value: string;
  onChange: (content: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  onInit?: (editor: any) => void;
  initialValue?: string;
}

export function ContentEditor({
  value,
  onChange,
  onBlur,
  error,
  touched,
  onInit,
  initialValue,
}: ContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !editorRef.current || quillRef.current) return;
    Promise.all([import("quill"), import("quill/dist/quill.snow.css")]).then(
      ([QuillModule]) => {
        const Quill = QuillModule.default;
        const quill = new Quill(editorRef.current!, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["link", "image"],
              ["clean"],
            ],
          },
          formats: [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "background",
            "align",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
          ],
        });

        quillRef.current = quill;
        if (initialValue || value) {
          quill.root.innerHTML = initialValue || value;
        }
        quill.on("text-change", () => {
          if (!isUpdatingRef.current) {
            const html = quill.root.innerHTML;
            onChange(html);
          }
        });
        quill.root.addEventListener("blur", onBlur);
        if (onInit) {
          onInit(quill);
        }
      }
    );
    return () => {
      if (quillRef.current) {
        quillRef.current.root.removeEventListener("blur", onBlur);
      }
    };
  }, [isClient, initialValue, onChange, onBlur, onInit, value]);
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdatingRef.current = true;
      quillRef.current.root.innerHTML = value;
      isUpdatingRef.current = false;
    }
  }, [value]);

  return (
    <FormField label="Content" required error={error} touched={touched}>
      <div ref={editorRef} style={{ height: "400px", marginBottom: "0px" }} />
    </FormField>
  );
}
