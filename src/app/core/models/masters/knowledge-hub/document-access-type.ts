export interface DocumentAccessType {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface DocumentAccessTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: DocumentAccessType[];
}