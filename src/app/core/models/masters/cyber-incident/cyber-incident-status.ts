export interface CyberIncidentStatuses {
    id: number;
    type: string;
    title: string;
    cyber_incident_status_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface CyberIncidentStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CyberIncidentStatuses[];
}