export interface IncidentDamageSeverity {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface IncidentDamageSeverityPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentDamageSeverity[];
}