export interface ProjectClosureWorkflowDetail{
    project_monitor_closure_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface ProjectClosureWorkflowHistory{
    id:number;
}

export interface ProjectClosureWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectClosureWorkflowHistory[];
}