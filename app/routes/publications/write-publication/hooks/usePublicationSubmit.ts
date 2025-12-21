import { useState } from "react";
import type { PublicationFormData } from "../publicationtypes";

interface SubmitMessage {
    type: "success" | "error";
    message: string;
}


export function usePublicationSubmit() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(
        null
    );
    const url = "https://embassy-backend.fly.dev/api/v1/";
    const submitPublication = async (formData: PublicationFormData) => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        try {
            const token = localStorage.getItem("access_token");
            const embassy = localStorage.getItem("embassy_id");
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }
            const submitData = new FormData();
            submitData.append("embassy_id", embassy || "");
            submitData.append("title", formData.title);
            submitData.append("publication_type", formData.publication_type);
            submitData.append("content", formData.content);
            submitData.append("status", formData.status);

            if (formData.tags) {
                submitData.append("tags", formData.tags);
            }

            if (formData.cover_image) {
                submitData.append("cover_image", formData.cover_image);
            }

            const response = await fetch(`${url}publications/`, {
                method: "POST",
                body: submitData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (response.status === 401) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("embassy_id");
                localStorage.removeItem("user_id");
                window.location.href = "/consular-panel-login";
                return { success: false, data: null };
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create publication");
            }

            const result = await response.json();
            setSubmitMessage({
                type: "success",
                message: "Publication created successfully!",
            });
            alert("Publication created successfully!");
            window.location.href = "/dashboard";
            return { success: true, data: result };
        } catch (error) {
            console.error("Error submitting publication:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An error occurred while creating the publication";

            setSubmitMessage({
                type: "error",
                message: errorMessage,
            });

            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        submitMessage,
        submitPublication,
        clearMessage: () => setSubmitMessage(null),
    };
}
