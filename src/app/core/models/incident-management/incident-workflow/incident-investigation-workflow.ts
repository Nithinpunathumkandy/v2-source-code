export interface IncidentInvestigationWorkflowDetail{
    incident_investigation_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface IncidentInvestigationWorkflowHistory{
    id:number;
    
}

export interface IncidentInvestigationWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentInvestigationWorkflowHistory[];
}