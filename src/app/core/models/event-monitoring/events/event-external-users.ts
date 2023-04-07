
export interface ExternalUsers {
    id: number;
    title: string;
    external_users: [];
}

export interface ExternalUsersPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    external_users: ExternalUsers[];
}

export interface IndividualExternalUsers {
    created_at: Date
    created_by;
    designation: string;
    email: string
    gender: string
    id: number
    name: string
    phone_number: string
    project;
    remarks: string
    updated_at: string
    updated_by;
}


