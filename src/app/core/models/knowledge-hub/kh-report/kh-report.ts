export interface KHReport {
    id: number;
    department: string;
    count: any;
}
export interface KHReportPaginationResponse {
    data: KHReport[];
}
export interface KHRiskDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface KHRiskDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KHRiskDetails[];
}
export interface KHReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    riskItemId: string; 
    riskTypeValue: string;
    riskTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
}
export interface StartEndDate {
    startDate: Date;
    endDate: Date;
    
}
