export interface BCMReport {
    id: number;
    department: string;
    count: any;
}

export interface BCMReportPaginationResponse {
    data: BCMReport[];
}
export interface BCMReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface BCMReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BCMReportDetails[];
}
export interface BCMReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    bcmItemId: string; 
    bcmTypeValue: string;
    bcmTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
