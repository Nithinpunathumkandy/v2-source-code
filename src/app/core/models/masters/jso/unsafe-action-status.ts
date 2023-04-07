export interface UnsafeActionStatus {
    id:number;
    type: string;
    unsafe_action_status_language: string;
    status: string;
    status_label: string;
}
export interface UnsafeActionStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: UnsafeActionStatus[];
}