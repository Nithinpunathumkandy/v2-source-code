export interface EventClosureStatus {
    id: number;
    type: string;
    label: string;
    status_label: string;
    status: string;
    status_id: number;
    color_code: string;
    language_id: number;
    event_closure_status_language_title: string;

          
}

export interface EventClosureStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventClosureStatus[];
}