export interface Investigation {
    id: number;
    title: string;
    incident_at : string;
    incident_investigation_categories : string;
    created_by_department : string;
    reported_by_first_name : string;
    reported_by_last_name : string;
    created_by_last_name : string;
    created_by_status : string;
    created_by_designation : string;
    created_by_image_token : string;
    reported_by_designation : string;
    updated_at : string;
    action : string;
    created_by;
    created_at: string;
    departments;
    description :string;
    divisions;
    branches;
    documents;
    incident;
    investigation_categories;
    incident_investigation_status;
    investigation_involved_users;
    investigation_root_causes;
    investigation_sub_categories;
    investigation_types;
    investigation_witness_users;
    involved_other_users;
    next_review_user_level
    observations;
    organizations;
    recommendations;
    points;
    references;
    reported_by;
    sections;
    stakeholders;
    sub_sections;
    submitted_by;
    reported_at : string
    witness_other_users;
    incident_damage_type;
    is_safe_work
    location : string;
    incident_damage_severity
    workflow_items




    

}

export interface InvestigationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Investigation[];
}

export interface HistoryData {
    data:History[];
    current_page: number;
     total: number;
     per_page: number;
     last_page: number;
 }

 export interface IncidentStatus {
    id: number;
    type: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface IncidentStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentStatus[];
}
 
 export interface History{
     id: number;
     incident_investigation_status_title: string;
     percentage: number;
     amount_used: string;
     created_at: string
     created_by: number
     created_by_department: string;
     created_by_designation: string;
     created_by_first_name: string;
     created_by_image_token: string;
     created_by_last_name: string
     created_by_status: string;
     incident_investigation_status_id: number
     incident_investigation_title: string;
     updated_at: string;
     documents:Document[];
     label:string;
     comment : string;
 
 }