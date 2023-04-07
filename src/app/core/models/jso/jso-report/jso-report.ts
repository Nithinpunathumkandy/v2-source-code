export interface JsoReport {
    id: number;
    department: string;
    count: any;
}
export interface JsoReportPaginationResponse {
    data: JsoReport[];
}
export interface JsoReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface JsoReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: JsoReportDetails[];
}
export interface JsoReportList {
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
