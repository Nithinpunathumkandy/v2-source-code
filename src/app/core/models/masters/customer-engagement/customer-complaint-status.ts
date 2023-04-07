export interface CustomerCompliantStatus {
    created_by_status: string;
    id:  number;
    title: string;
    type: string;
}

export interface CustomerCompliantStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerCompliantStatus[];
}