import { useState } from "react";
import type { PublicationFormData } from "../publicationtypes";
import {
    PublicationTypes,
    PublicationStatus,
    PublicationTags,
    generateSlug,
} from "../publicationtypes";
import {
    validateTitle,
    validateContent,
    validateCoverImage,
    validateForm,
    type ValidationErrors,
} from "../formvalidators";

export function usePublicationForm() {
    const [formData, setFormData] = useState<PublicationFormData>({
        title: "",
        slug: "",
        publication_type: PublicationTypes.ARTICLE,
        content: "",
        cover_image: null as string | File | null,
        tags: [PublicationTags.GENERAL],
        status: PublicationStatus.DRAFT,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
        null
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        // Auto-generate slug when title changes
        if (name === "title") {
            const slug = generateSlug(value);
            setFormData((prev) => ({
                ...prev,
                title: value,
                slug: slug,
            }));
        } else if (name === "tags") {
            // Convert single tag value to array
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

        // Validate on blur
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

            return { success: true };
        }
        return { success: false };
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

    const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            // Convert Files to data URLs or file names as strings
            const filePromises = fileArray.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(fileStrings => {
                setFormData((prev) => ({
                    ...prev,
                    attachments: fileStrings,
                }));
            });
        }
    };

    const validateFormData = () => {
        setTouched({
            title: true,
            slug: true,
            publication_type: true,
            content: true,
            status: true,
            cover_image: true,
            attachments: true,
            tags: true,
        });
        const validationErrors = validateForm({
            ...formData,
            cover_image: formData.cover_image instanceof File ? formData.cover_image : null,
        });
        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            publication_type: PublicationTypes.ARTICLE,
            content: "",
            cover_image: null,
            // reset tags array to empty
            tags: [PublicationTags.GENERAL],
            attachments: [],
            status: PublicationStatus.DRAFT,
        });
        setCoverImagePreview(null);
        setErrors({});
        setTouched({});
    };

    return {
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
    };
}
