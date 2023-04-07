export interface AuditWorkflowDetail{
    // business_impact_analysis_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
    type:string;
    user_type;
}

export interface AuditWorkflowHistory{
    id:number;
}

export interface AuditWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditWorkflowHistory[];
}