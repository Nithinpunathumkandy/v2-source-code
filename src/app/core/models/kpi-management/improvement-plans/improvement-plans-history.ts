
export interface HistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: History[];
}

export interface History{
    id: number;
    comment: string;
    percentage: number;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    updated_at: string;
    kpi_management_kpi_improvement_plan_status_id:number;
    kpi_management_kpi_improvement_plan_status_label:string;
    kpi_management_kpi_improvement_plan_status_title:string;
    documents:Document[];
    label:string;
}