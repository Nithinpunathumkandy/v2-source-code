export interface AnnualPlanFrequencyItem {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface AnnualPlanFrequencyItemPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AnnualPlanFrequencyItem[];
}