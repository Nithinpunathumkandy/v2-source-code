export interface IncidentInvestigationStatus{
    id: number;
    incident_investigation_status_language: string;
    status: string;
    status_id: number;
    status_label: string;
    type: string;
}

export interface IncidentInvestigationStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentInvestigationStatus[];
}