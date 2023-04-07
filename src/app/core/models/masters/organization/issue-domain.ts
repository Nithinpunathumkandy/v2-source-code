export interface IssueDomain {
    id: number;
    title: string;
    status_id :number;
    status_label: string;
}

export interface IssueDomainPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IssueDomain[];
}