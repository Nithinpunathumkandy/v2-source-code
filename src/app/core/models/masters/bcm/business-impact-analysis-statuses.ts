export interface BusinessImpactAnalysisStatuses {
    id: number;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
    color_code:string;
}
export interface BusinessImpactAnalysisStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BusinessImpactAnalysisStatuses[];
}