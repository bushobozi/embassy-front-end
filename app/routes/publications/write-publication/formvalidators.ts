export interface ValidationErrors {
    title?: string;
    publication_type?: string;
    content?: string;
    status?: string;
    cover_image?: string;
}

export const validateTitle = (title: string): string | undefined => {
    if (!title || !title.trim()) {
        return "Title is required";
    }
    if (title.trim().length < 3) {
        return "Title must be at least 3 characters long";
    }
    if (title.length > 200) {
        return "Title must not exceed 200 characters";
    }
    return undefined;
};

export const validatePublicationType = (
    type: string
): string | undefined => {
    if (!type || !type.trim()) {
        return "Publication type is required";
    }
    return undefined;
};

export const validateContent = (content: string): string | undefined => {
    if (!content || !content.trim() || content.trim() === "<p></p>") {
        return "Content is required";
    }
    // Remove HTML tags to check actual content length
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 10) {
        return "Content must be at least 10 characters long";
    }
    return undefined;
};

export const validateStatus = (status: string): string | undefined => {
    if (!status || !status.trim()) {
        return "Status is required";
    }
    return undefined;
};

export const validateCoverImage = (file: File | null): string | undefined => {
    if (!file) {
        return undefined; // Image is optional
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        return "Image file size must be less than 10MB";
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return "Please select a valid image file";
    }

    return undefined;
};

export const validateForm = (formData: {
    title: string;
    publication_type: string;
    content: string;
    status: string;
    cover_image: File | null;
}): ValidationErrors => {
    const errors: ValidationErrors = {};

    const titleError = validateTitle(formData.title);
    if (titleError) errors.title = titleError;

    const typeError = validatePublicationType(formData.publication_type);
    if (typeError) errors.publication_type = typeError;

    const contentError = validateContent(formData.content);
    if (contentError) errors.content = contentError;

    const statusError = validateStatus(formData.status);
    if (statusError) errors.status = statusError;

    const imageError = validateCoverImage(formData.cover_image);
    if (imageError) errors.cover_image = imageError;

    return errors;
};
