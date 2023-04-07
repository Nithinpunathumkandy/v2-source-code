export interface MsAuditReports {
    id: number;
    department: string;
    count: any;
}
export interface MsAuditReportsPaginationResponse {
    data: MsAuditReports[];
}
export interface MsAuditDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface MsAuditDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditDetails[];
}
export interface MsAuditReportList {
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
