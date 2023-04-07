export interface BcsFinance {
    id: number;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
}
export interface BcsFinancePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BcsFinance[];
}