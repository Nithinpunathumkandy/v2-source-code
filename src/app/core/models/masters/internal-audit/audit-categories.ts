export interface AuditCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface AuditCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditCategory[];
}