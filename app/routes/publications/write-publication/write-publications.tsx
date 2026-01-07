import { useRef } from "react";
import type { Route } from "./+types/write-publications";
import type { FormEvent } from "react";
import { Button, BreadCrumb } from "~/components";
import {
  TitleInput,
  PublicationTypeSelect,
  TagsSelect,
  StatusSelect,
  CoverImageUpload,
  ContentEditor,
  AttachmentsUpload,
  AlertMessage,
} from "./components";
import { usePublicationForm, usePublicationSubmit } from "./hooks";
import Preview from "./preview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Publication" },
    { name: "description", content: "Embassy Create Publication" },
  ];
}

export default function WritePublications() {
  const editorRef = useRef<any>(null);

  const {
    formData,
    errors,
    touched,
    coverImagePreview,
    handleInputChange,
    handleBlur,
    handleFileChange,
    handleEditorChange,
    handleAttachmentsChange,
    validateFormData,
    resetForm,
  } = usePublicationForm();
  const { isSubmitting, submitMessage, submitPublication, clearMessage } =
    usePublicationSubmit();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    if (!validateFormData()) {
      return;
    }
    const result = await submitPublication(formData);
    if (result.success) {
      resetForm();
      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
      }
      const fileInput = document.getElementById(
        "cover_image"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };
  const handleClearForm = () => {
    if (confirm("Are you sure you want to clear the form?")) {
      resetForm();
      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
      }
      const fileInput = document.getElementById(
        "cover_image"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = handleFileChange(e);
    if (result && !result.success && result.error) {
      console.error("File upload error:", result.error);
    }
  };
  return (
    <div className="container mx-auto w-full h-full my-4">
      <Preview
        title={formData.title}
        content={formData.content}
        publicationType={formData.publication_type}
        tags={formData.tags}
        coverImagePreview={coverImagePreview}
      />
      <div className="relative">
        <div className="fixed bottom-0 right-5 bg-gray-950 text-white shadow-lg z-10 w-fit h-fit rounded-t-2xl p-4 overflow-auto">
          <h2 className="text-xl font-semibold text-gray-200 mb-4 p-2">
            Preview Publication
          </h2>
          <div className="flex">
            <Button
              variant="secondary"
              size="md"
              block={true}
              className="mt-4"
              onClick={() =>
                (
                  document.getElementById("my_modal_2") as HTMLDialogElement
                )?.showModal()
              }
            >
              Preview
            </Button>
          </div>
        </div>
      </div>
      <BreadCrumb
        links={[
          { label: "Latest News Updates", href: "/home_embassy" },
          { label: "My News Updates", href: "/em_my_publications" },
          {
            label: "Create New News Update",
          },
        ]}
      />
      <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-xl">
          Create News Update Publication
        </legend>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TitleInput
            value={formData.title}
            onChange={handleInputChange}
            onBlur={() => handleBlur("title")}
            error={errors.title}
            touched={touched.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PublicationTypeSelect
              value={formData.publication_type}
              onChange={handleInputChange}
            />
            <TagsSelect
              value={formData.tags[0] || ""}
              onChange={handleInputChange}
            />
            <StatusSelect
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
          <CoverImageUpload
            onChange={handleFileInputChange}
            error={errors.cover_image}
            preview={coverImagePreview}
          />
          <AttachmentsUpload
            onChange={handleAttachmentsChange}
            error={errors.attachments}
            files={formData.attachments as File[] | undefined}
          />
          <ContentEditor
            value={formData.content}
            onChange={handleEditorChange}
            onBlur={() => handleBlur("content")}
            error={errors.content}
            touched={touched.content}
            onInit={(editor) => (editorRef.current = editor)}
          />
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={handleClearForm}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Clear Form
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              block={false}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create Publication"
              )}
            </Button>
          </div>
          {submitMessage && (
            <AlertMessage
              type={submitMessage.type}
              message={submitMessage.message}
            />
          )}
        </form>
      </fieldset>
    </div>
  );
}
