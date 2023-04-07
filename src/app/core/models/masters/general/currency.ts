export interface Currency {
    id: number;
    title: string;
    code: string;
    icon: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface CurrencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Currency[];
}