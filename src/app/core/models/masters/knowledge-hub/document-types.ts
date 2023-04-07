export interface DocumentTypes {
    id: number;
    title: string;
    status: string;
    status_id: number;
    is_important: boolean;
    is_compliance: boolean;
    status_label: string;
    description: string;
}

export interface DocumentTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DocumentTypes[];
}