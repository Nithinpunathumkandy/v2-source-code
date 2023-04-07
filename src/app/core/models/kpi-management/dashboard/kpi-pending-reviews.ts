//kpi 
export interface KpiPendingReviewsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiPendingReviews[];
}

export interface KpiPendingReviews {
    id: number;
    title: string;
    reference_code:string;
    kpi_calculation_type: string;
    departments:string;
    kpi_management_status_color_code: string;
    kpi_management_status_label: string;
    kpi_management_status_title: string;
    kpi_management_status_type: string;
    kpi_type:string;
    kpi_category:string;
    
}

//kpi score
export interface KpiScorePendingReviewsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiScorePendingReviews[];
}

export interface KpiScorePendingReviews {
    departments: string;
    divisions: string;
    id: number;
    kpi_management_kpi_score_status_color_code: string;
    kpi_management_kpi_score_status_label: string;
    kpi_management_kpi_score_status_type: string;
    kpi_type: string;
    title:  string;
    updated_at: string;
    updated_by: number;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
}