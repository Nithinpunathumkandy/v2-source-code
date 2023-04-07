export interface Reports {
    id: number;
    department: string;
    count: any;
}
export interface ReportsPaginationResponse {
    data: Reports[];
}
export interface RiskDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface RiskDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: RiskDetails[];
}
export interface ReportList {
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
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
