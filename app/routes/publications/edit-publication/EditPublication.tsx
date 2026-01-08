import { useRef, useEffect, useState, type FormEvent } from "react";
import type { Route } from "./+types/EditPublication";
import { Button, BreadCrumb } from "~/components";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  TitleInput,
  PublicationTypeSelect,
  TagsSelect,
  StatusSelect,
  CoverImageUpload,
  ContentEditor,
  AttachmentsUpload,
  AlertMessage,
} from "../write-publication/components";
import type { PublicationFormData } from "../write-publication/publicationtypes";
import { generateSlug } from "../write-publication/publicationtypes";
import {
  validateTitle,
  validateContent,
  validateCoverImage,
  validateForm,
  type ValidationErrors,
} from "../write-publication/formvalidators";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Update Publication - ${params.publicationId}` },
    { name: "description", content: "Embassy publication update page" },
  ];
}

interface SubmitMessage {
  type: "success" | "error";
  message: string;
}

export default function EditPublication({
  params,
}: {
  params: { publicationId: string };
}) {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const { user, accessToken } = useAuth();
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const PUBLICATION_URL = `${URL}/publications/${params.publicationId}`;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(
    null
  );
  const [formData, setFormData] = useState<PublicationFormData>({
    title: "",
    slug: "",
    publication_type: "ARTICLE",
    content: "",
    cover_image: null,
    tags: ["GENERAL"],
    status: "DRAFT",
    attachments: [],
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  // Fetch existing publication data
  const getPublicationData = async () => {
    setLoading(true);
    try {
      const response = await fetch(PUBLICATION_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch publication data"
        );
      }

      const data = await response.json();
      
      // Populate form with existing data
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        publication_type: data.publication_type || "ARTICLE",
        content: data.content || "",
        cover_image: data.cover_image || null,
        tags: Array.isArray(data.tags) ? data.tags : ["GENERAL"],
        status: data.status || "DRAFT",
        attachments: data.attachments || [],
      });

      // Set cover image preview if exists
      if (data.cover_image) {
        setCoverImagePreview(data.cover_image);
      }

      // Set editor content after a short delay to ensure editor is initialized
      setTimeout(() => {
        if (editorRef.current && data.content) {
          editorRef.current.root.innerHTML = data.content;
        }
      }, 100);
    } catch (err: any) {
      setSubmitMessage({
        type: "error",
        message: err.message || "Failed to load publication data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPublicationData();
  }, [params.publicationId]);

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: slug,
      }));
    } else if (name === "tags") {
      setFormData((prev) => ({
        ...prev,
        tags: [value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (touched[name]) {
      if (name === "title") {
        const error = validateTitle(value);
        setErrors((prev) => ({ ...prev, title: error }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "title") {
      const error = validateTitle(formData.title);
      setErrors((prev) => ({ ...prev, title: error }));
    } else if (field === "content") {
      const error = validateContent(formData.content);
      setErrors((prev) => ({ ...prev, content: error }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateCoverImage(file);
      if (error) {
        setErrors((prev) => ({ ...prev, cover_image: error }));
        return { success: false, error };
      }

      setErrors((prev) => ({ ...prev, cover_image: undefined }));
      setFormData((prev) => ({
        ...prev,
        cover_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));

    if (touched.content) {
      const error = validateContent(content);
      setErrors((prev) => ({ ...prev, content: error }));
    }
  };

  const handleAttachmentsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        attachments: fileArray as any,
      }));
    }
  };

  const validateFormData = (): boolean => {
    const validationResult = validateForm({
      ...formData,
      cover_image: formData.cover_image instanceof File ? formData.cover_image : null,
    });

    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      setTouched({
        title: true,
        content: true,
        cover_image: true,
      });
      return false;
    }

    return true;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Update publication handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      // Convert cover image File to base64 string, otherwise use existing string
      let coverImageString: string | null = null;
      if (formData.cover_image instanceof File) {
        coverImageString = await fileToBase64(formData.cover_image);
      } else if (
        typeof formData.cover_image === "string" &&
        formData.cover_image.trim() !== ""
      ) {
        coverImageString = formData.cover_image;
      }

      // Convert attachment Files to base64 strings
      const attachmentsStrings: string[] = [];
      if (formData.attachments && Array.isArray(formData.attachments)) {
        for (const item of formData.attachments) {
          if (typeof item === "string" && item.trim() !== "") {
            attachmentsStrings.push(item);
          }
        }
      }

      const updateData = {
        title: formData.title,
        slug: formData.slug,
        publication_type: formData.publication_type,
        content: formData.content,
        status: formData.status,
        tags: formData.tags || [],
        attachments: attachmentsStrings,
        cover_image: coverImageString,
      };

      const response = await fetch(PUBLICATION_URL, {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "/consular_login";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update publication");
      }

      const result = await response.json();
      setSubmitMessage({
        type: "success",
        message: "Publication updated successfully!",
      });
      
      alert("Publication updated successfully!");
      navigate(`/publication_detail_view_id/${params.publicationId}/viewed`);
    } catch (error) {
      console.error("Error updating publication:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the publication";

      setSubmitMessage({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate(`/publication_detail_view_id/${params.publicationId}/viewed`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto w-full h-full my-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full h-full my-4">
      <BreadCrumb
        links={[
          { label: "Latest News Updates", href: "/home_embassy" },
          { label: "Manage Publications", href: "/em_manage_publications" },
          {
            label: formData.title || "Edit Publication",
            href: `/publication_detail_view_id/${params.publicationId}/viewed`,
          },
          { label: "Edit" },
        ]}
      />
      <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-xl">
          Update News Publication
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
            onChange={handleFileChange}
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
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
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
                  Updating...
                </>
              ) : (
                "Update Publication"
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