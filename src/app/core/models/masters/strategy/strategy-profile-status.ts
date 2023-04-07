export interface StrategyProfileStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface StrategyProfileStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: StrategyProfileStatus[];
}