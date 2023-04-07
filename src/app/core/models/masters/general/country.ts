export interface Country {
    id: number;
    title: string;
    status: string;
    status_id :number;
    region_id: number;
    region_title: string;
    status_label: string;
}
export interface CountryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Country[];
}