export interface RiskInfoWorkflowDetail{
    risk_journey_workflow_item_users: any;
    risk_workflow_item_users: any;
    level: number;
    id:number;
}

export interface RiskWorkflowHistory{
    id:number;
    
}

export interface RiskWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: RiskWorkflowHistory[];
}