export interface IncidentCaWorkflowDetail{
    incident_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface IncidentCaWorkflowHistory{
    id:number;
    
}

export interface IncidentCaWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentCaWorkflowHistory[];
}