export interface ProcessReports {
    id: number;
    department: string;
    count: any;
}
export interface ProcessReportsPaginationResponse {
    data: ProcessReports[];
}
export interface ProcessRiskDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface ProcessRiskDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProcessRiskDetails[];
}
export interface ProcessReportList {
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
    listPermission?: string;
}
export interface StartEndDate {
    startDate: Date;
    endDate: Date;
    
}
