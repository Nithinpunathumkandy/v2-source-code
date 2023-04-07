export interface AuditReportWorkflowDetail{
    audit_report_workflow_item_users: any;
    level: number;
    id:number;
}

export interface AuditReportWorkflowHistory{
    id:number;
    
}

export interface AuditReportWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditReportWorkflowHistory[];
}