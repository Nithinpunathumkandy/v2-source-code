export interface KpiManagementStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface KpiManagementStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiManagementStatus[];
}