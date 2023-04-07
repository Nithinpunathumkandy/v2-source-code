export interface AuditCheckListPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditCheckLists[];
}

export interface AuditCheckLists {
    
}
