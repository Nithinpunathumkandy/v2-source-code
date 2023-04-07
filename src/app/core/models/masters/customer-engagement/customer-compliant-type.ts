export interface CustomerType {
    // id: number;
    // title: string;
    // status: string;
    // status_id: number;
    // status_label: string;
    // description: string;

    created_by_status: string;
    id: number;
    title: string;
    type: string;
}

export interface CustomerTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerType[];
}