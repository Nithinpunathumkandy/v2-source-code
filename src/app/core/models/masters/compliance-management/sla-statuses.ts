export interface SlaStatuses {
    id: number;
    sla_status_language: string;
    type: string;
}
export interface SlaStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SlaStatuses[];
}