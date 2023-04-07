export interface AmAuditReport {
    id: number;
    department: string;
    count: any;
}
export interface AmAuditReportPaginationResponse {
    data: AmAuditReport[];
}
export interface AmAuditReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AmAuditReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmAuditReportDetails[];
}
export interface AmAuditReportList {
    id?: string;
    checkLevel?: any;
    checkType?:any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    amAuditItemId: string; 
    amAuditTypeValue: string;
    amAuditTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}