export interface AuditPlanWorkflowDetail{
    audit_plan_workflow_item_users: any;
    // risk_journey_workflow_item_users: any;
    // risk_workflow_item_users: any;
    level: number;
    id:number;
}

export interface AuditPlanWorkflowHistory{
    id:number;
    
}

export interface AuditPlanWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditPlanWorkflowHistory[];
}