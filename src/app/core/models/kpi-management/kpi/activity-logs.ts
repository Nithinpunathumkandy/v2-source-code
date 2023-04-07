export interface ActivityLoagsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualActivityLoags[];
}

export interface IndividualActivityLoags {
    id: number;
    activity:string;
    activity_type:string;
    created_at:string;
    created_by_department:string;
    created_by_designation:string;
    created_by_first_name:string;
    created_by_image_token:string;
    created_by_last_name:string;
    created_by_status:string;
    data:Data;
    detail:Detail[];
}

export interface Data{
    kpi_management_kpi:KpiManagementKpi;
}

export interface KpiManagementKpi{
    created_at:string,
    created_by: number,
    department_id: number,
    description: string,
    end_date: string,
    id: number,
    kpi_id: number,
    kpi_management_status_id: number,
    kpi_review_frequency_id: number,
    next_review_user_level: number,
    reference_code: string,
    start_date: string,
    updated_at: string,
}

export interface Detail{
    activity_log_id: number,
    changed_from: string,
    changed_to: string,
    comments: string,
    details: string,
    id: number,
    new_item: string,
    removed_item: string,
    type: string,
}