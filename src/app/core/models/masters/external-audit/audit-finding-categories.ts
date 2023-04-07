export interface AuditFindingCategory {
    id: number;
    title: string;
    label:string;
    color_code:string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AuditFindingCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditFindingCategory[];
}