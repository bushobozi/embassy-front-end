export interface PublicationBody {
    id: string;
    embassy_id: string;
    title: string;
    content: string;
    slug: string;
    cover_image: string;
    attachments: string[];
    tags: string[];
    publication_type: string;
    status: string;
    published_at: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    embassy: {
        name: string;
        embassy_picture: string | null;
    };
    embassy_name: string;
    embassy_picture: string;
}