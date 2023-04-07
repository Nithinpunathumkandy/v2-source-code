export interface IncidentTemplates {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
    incident_report_template_pages
    
}

export interface IncidentTemplatesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentTemplates[];
}