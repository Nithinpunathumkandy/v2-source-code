export interface AssetReport {
    id: number;
    department: string;
    count: any;
}
export interface AssetReportPaginationResponse {
    data: AssetReport[];
}
export interface AssetReportDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AssetReportDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetReportDetails[];
}
export interface AssetReportList {
    id?: string;
    checkLevel?: any;
    checkType?:any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    assetItemId: string; 
    assetTypeValue: string;
    assetTypeValue2 ?: string;
    tabletiltle: string; 
    activityname: string;
    listPermission?: string;
}
export interface CustomDate {
    startDate: Date;
    endDate: Date;
    
}
