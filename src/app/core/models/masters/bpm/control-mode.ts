export interface ControlMode {
    id: number;
    title: string;
    status_id: number;
    status: string;
    status_label: string;
}

export interface ControlModePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: ControlMode[];
}