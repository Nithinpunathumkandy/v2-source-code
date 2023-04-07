export interface AnnualPlanFrequency {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface AnnualPlanFrequencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AnnualPlanFrequency[];
}