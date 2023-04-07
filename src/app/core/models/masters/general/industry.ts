export interface Industry {
    id: number;
    title: string;
    status: string;
    status_id :number;
    industry_category_id: number;
    industry_category_title: string;
    status_label: string;
}
export interface IndustryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Industry[];
}