
export interface DocumentChangeRequestType {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface DocumentChangeRequestTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: DocumentChangeRequestType[];
}