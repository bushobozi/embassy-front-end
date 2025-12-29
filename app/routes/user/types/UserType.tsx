export interface UserBody {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    phone_number: string;
    address: string;
    date_of_birth: string;
    work_phone_number: string;
    work_email: string;
    emergency_contact_name: string;
    emergency_contact_phone_number: string;
    emergency_contact_relationship: string;
    department: string;
    position: string;
    hire_date: string;
    biography: string;
    profile_picture: string;
    languages: string[];
    certifications: string[];
    social_media_links: {
        linkedin: string;
        twitter: string;
    };
    previous_employers: string[];
    education: string[];
    embassy_id: string | number;
}
