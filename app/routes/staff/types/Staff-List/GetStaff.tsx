export interface StaffList {
    id: string;
    user_id: string;
    embassy_id: string;
    photo: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    gender: string;
    religion: string;
    marital_status: string;
    country: string;
    nationality: string;
    staff_status: string;
    hire_date: string;
    created_at: string;
    updated_at: string;
}

export interface StaffListResponse {
    data: StaffList[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const defaultStaffListResponse: StaffListResponse = {
    data: [
        {
            id: '',
            user_id: '',
            embassy_id: '',
            photo: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            position: '',
            department: '',
            gender: '',
            religion: '',
            marital_status: '',
            country: '',
            nationality: '',
            staff_status: '',
            hire_date: '',
            created_at: '',
            updated_at: '',
        },
    ],
    meta: {
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
    },
};