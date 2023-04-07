export interface ProjectReport {
    id: number;
    department: string;
    count: any;
}
export interface ProjectReportPaginationResponse {
    data: ProjectReport[];
}
export interface ProjectReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface ProjectReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectReportDetails[];
}
export interface ProjectReportList {
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
