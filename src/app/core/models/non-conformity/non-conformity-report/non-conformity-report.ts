export interface NonComformityReport {
    id: number;
    department: string;
    count: any;
}

export interface NonComformityReportPaginationResponse {
    data: NonComformityReport[];
}
export interface NonComformityReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface NonComformityReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: NonComformityReportDetails[];
}
export interface NonComformityReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    reportUniqueKey: string; 
    nonComformityItemId: string; 
    nonComformityTypeValue: string;
    nonComformityTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
