
export interface MsAuditNonConfirmitiesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditNonConfirmities[];
}

export interface MsAuditNonConfirmities {
    id: number;
    reference_code: string;
    description: string;
    date: string;
    agreed_date: string;
    document_version_content_title: string;
    responsible_users: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token: string;
    created_by_designation: string;
    created_by_department: string;
    created_by_status: string;
    created_at: string;
    updated_by?: any;
    updated_by_first_name?: any;
    updated_by_last_name?: any;
    updated_by_image_token?: any;
    updated_by_designation?: any;
    updated_by_department?: any;
    updated_by_status?: any;
    updated_at: string;
}



