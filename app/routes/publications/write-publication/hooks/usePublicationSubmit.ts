import { useState } from "react";
import type { PublicationFormData } from "../publicationtypes";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate } from "react-router";

interface SubmitMessage {
    type: "success" | "error";
    message: string;
}


export function usePublicationSubmit() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(
        null
    );
    const { user, accessToken } = useAuth();
    const URL = import.meta.env.VITE_API_URL;
    const PUBLISHURL = `${URL}/publications`;

    const goToPublicationsList = () => {
        navigate("/em_my_publications");
    }
    
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
    
    const submitPublication = async (formData: PublicationFormData) => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        try {
            const token = accessToken;
            const embassy = user?.embassy_id;
            const user_id = user?.id;
            const url = PUBLISHURL;
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }
            
            // Convert cover image File to base64 string, otherwise use existing string
            let coverImageString: string | null = null;
            if (formData.cover_image instanceof File) {
                console.log('Converting cover image to base64:', formData.cover_image.name);
                coverImageString = await fileToBase64(formData.cover_image);
            } else if (typeof formData.cover_image === "string" && formData.cover_image.trim() !== "") {
                coverImageString = formData.cover_image;
            }

            // Convert attachment Files to base64 strings, otherwise use existing strings
            const attachmentsStrings: string[] = [];
            if (formData.attachments && Array.isArray(formData.attachments)) {
                for (const item of formData.attachments) {
                    if (typeof item === "string" && item.trim() !== "") {
                        attachmentsStrings.push(item);
                    }
                }
            }

            const submitData = {
                embassy_id: embassy || "",
                created_by: user_id || "",
                title: formData.title,
                slug: formData.slug,
                publication_type: formData.publication_type,
                content: formData.content,
                status: formData.status,
                tags: formData.tags || [],
                attachments: attachmentsStrings,
                cover_image: coverImageString,
            };

            const response = await fetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(submitData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (response.status === 401) {
                window.location.href = "/consular_login";
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
            goToPublicationsList();
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
