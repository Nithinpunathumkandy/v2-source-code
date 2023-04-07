export interface AuditableItemType {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface AuditableItemTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: AuditableItemType[];
}