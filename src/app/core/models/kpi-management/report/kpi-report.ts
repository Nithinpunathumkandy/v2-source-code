export interface KpiReport {
    id: number;
    department: string;
    count: any;
}

export interface KpiReportPaginationResponse {
    data: KpiReport[];
}
export interface KpiReportDetails {
    id: number;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
    
    reference_code:string;
    title: string;
    departments:string;
    kpi_management_status_label:string;
    kpi_management_status_title:string;

    kpi_title:string;
    date:string;
    score:number;
    updated_by_first_name:string;
    updated_by_image_token:string;
    updated_by_last_name:string;
    updated_by_designation:string;
    created_by_image_token:string;
    reviewed_by_first_name:string;
    reviewed_by_last_name:string;
    reviewed_by_designation:string;
    kpi_management_kpi_score_status_label:string;
    kpi_management_kpi_score_status_title:string;
}
export interface KpiReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiReportDetails[];
}
export interface KpiReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    kpiItemId: string; 
    kpiTypeValue: string;
    kpiTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
