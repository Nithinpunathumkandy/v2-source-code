export interface ComplianceReport {
    id: number;
    department: string;
    count: any;
}
export interface ComplianceReportPaginationResponse {
    data: ComplianceReport[];
}
export interface ComplianceReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface ComplianceReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceReportDetails[];
}
export interface ComplianceReportList {
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
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
