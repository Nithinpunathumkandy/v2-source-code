export interface StrategyManagementReportList {
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

export interface StrategyManagementReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface StrategyManagementReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyManagementReportDetails[];
}

export interface StrategyManagementReport {
    id: number;
    department: string;
    count: any;
}
export interface StrategyManagementReportPaginationResponse {
    data: StrategyManagementReport[];
}