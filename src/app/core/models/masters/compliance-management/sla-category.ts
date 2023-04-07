export interface SlaCategory {
    id: number;
    title: string;
    description: string;
    status_id :number;
    status_label: string;
}
export interface SlaCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SlaCategory[];
}