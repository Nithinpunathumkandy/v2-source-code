export interface BcsStatus {
    color_code: string;
    created_by_status: string;
    id: number;
    label: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
}
export interface BcsStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BcsStatus[];
}