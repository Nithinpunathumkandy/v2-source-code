export interface DocumentFamily {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    description: string;
}

export interface DocumentFamilyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DocumentFamily[];
}