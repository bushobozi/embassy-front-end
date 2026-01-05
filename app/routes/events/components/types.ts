// Shared types for event components

export interface EmbassyEvent {
    id: string;
    event_name: string;
    event_image: string | null;
    event_type: string;
    event_cost: number;
    is_paid: boolean;
    is_active: boolean;
    is_public: boolean;
    is_virtual: boolean;
    is_private: boolean;
    event_start_date: string;
    event_end_date: string;
    event_location: string;
    max_attendees: number;
    event_description: string;
    registration_deadline: string | null;
    embassy_id: string;
    embassy_name: string;
    embassy_picture: string | null;
    created_at: string;
    created_by: string;
    updated_at: string;
}

export interface CalendarEvent {
    id: string;
    event_name: string;
    event_start_date: string;
    event_end_date: string;
    event_type: string;
    color: string;
    bgColor?: string;
    attendees?: string[];
    event_location?: string;
    event_description?: string;
    event_image: string | null;
    embassy_name?: string;
    embassy_picture?: string | null;
}

export type ViewType = "month" | "week" | "day";
export type FilterType = "all" | "my-embassy";
