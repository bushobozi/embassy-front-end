import { useState } from "react";
import type { PublicationFormData } from "../publicationtypes";
import {
    PublicationTypes,
    PublicationStatus,
    PublicationTags,
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
        publication_type: PublicationTypes.ARTICLE,
        content: "",
        cover_image: null,
        tags: PublicationTags.GENERAL,
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const validateFormData = () => {
        setTouched({
            title: true,
            publication_type: true,
            content: true,
            status: true,
            cover_image: true,
        });
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            title: "",
            publication_type: PublicationTypes.ARTICLE,
            content: "",
            cover_image: null,
            tags: PublicationTags.GENERAL,
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
        validateFormData,
        resetForm,
    };
}
