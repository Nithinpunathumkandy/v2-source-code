export interface TrainingReport {
    id: number;
    department: string;
    count: any;
}
export interface TrainingReportPaginationResponse {
    data: TrainingReport[];
}
export interface TrainingReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface TrainingReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TrainingReportDetails[];
}
export interface TrainingReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    trainingItemId: string; 
    trainingTypeValue: string;
    trainingTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
