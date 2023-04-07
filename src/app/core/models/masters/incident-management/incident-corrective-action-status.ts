export interface IncidentCorrectiveActionStatus {
    id: number;
    incident_corrective_action_status_language: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface IncidentCorrectiveActionStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentCorrectiveActionStatus[];
}