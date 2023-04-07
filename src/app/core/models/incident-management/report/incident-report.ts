export interface IncidentReport {
    id
    conclusion,
    corrective_action,
    incident_investigation,
    incident_mapping,
    introduction,
    investigator,
    root_cause_analysis
    incident_cover_page,
    index_page,
}

export interface IncidentReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentReport[];
}
