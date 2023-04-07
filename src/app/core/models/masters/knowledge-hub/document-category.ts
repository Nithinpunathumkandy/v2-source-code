export interface DocumentCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    description: string;
}

export interface DocumentCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DocumentCategory[];
}