export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  role: string;
  is_active: boolean;
  embassy_id: string;
  phone_number: string | null;
  work_phone_number: string | null;
  work_email: string | null;
  address: string | null;
  date_of_birth: string | null;
  biography: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone_number: string | null;
  emergency_contact_relationship: string | null;
  department: string | null;
  position: string | null;
  hire_date: string | null;
  profile_picture: string | null;
}

export interface UsersResponse {
  data: User[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
