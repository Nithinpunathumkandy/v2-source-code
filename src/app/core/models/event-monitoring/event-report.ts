export interface Reports {
    id: number;
    department: string;
    count: any;
}
export interface ReportsPaginationResponse {
    data: Reports[];
}
export interface EventDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface EventDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventDetails[];
}
export interface ReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    eventItemId: string; 
    eventTypeValue: string;
    eventTypeValue2 ?: string;
    eventTypeValue3 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
