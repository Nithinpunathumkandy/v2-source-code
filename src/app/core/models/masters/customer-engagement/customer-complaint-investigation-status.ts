export interface CustomerCompliantInvestigationStatus {
    // created_by_status: string;
    // id:  number;
    // title: string;
    // type: string;
}

export interface CustomerCompliantInvestigationStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerCompliantInvestigationStatus[];
}