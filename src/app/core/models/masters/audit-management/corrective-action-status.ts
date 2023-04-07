export interface CorrectiveActionStatus {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface CorrectiveActionStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CorrectiveActionStatus[];
}
export interface CorrectiveActionStatusSingle {
    id: number;
    title:string;
    label:string;
    color_code:string;
}