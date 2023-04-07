export interface IncidentInfoWorkflowDetail{
    incident_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface IncidentInfoWorkflowHistory{
    id:number;
    
}

export interface IncidentInfoWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentInfoWorkflowHistory[];
}