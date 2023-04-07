export interface BiaWorkflowDetail{
    business_impact_analysis_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface BiaWorkflowHistory{
    id:number;
}

export interface BiaWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BiaWorkflowHistory[];
}