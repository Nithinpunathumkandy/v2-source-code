export interface ProjectWorkflowDetail{
    // business_impact_analysis_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface ProjectWorkflowHistory{
    id:number;
}

export interface ProjectWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectWorkflowHistory[];
}